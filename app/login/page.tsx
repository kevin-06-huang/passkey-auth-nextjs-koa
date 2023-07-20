"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/store/auth";
import { useRef } from "react";
import { startAuthentication } from "@simplewebauthn/browser";

export default function Login() {
  const router = useRouter();
  const store = useStore();
  const username = useRef<HTMLInputElement>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const res = fetch("http://localhost:3500/login/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.current!.value,
        }),
      });
      
      const opts = await (await res).json();
      const verifyReqBody = await startAuthentication(opts);
      
      const verificationResp = await fetch("http://localhost:3500/login/verify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyReqBody),
      });

      const verifyJSON = await (await verificationResp).json();
      
      if (verifyJSON && verifyJSON.verified) {
        store.setAuthUser(verifyJSON.user);
        router.push("/profile");
      } else {
        alert(verifyJSON.status);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <section className="bg-ct-blue-600 min-h-screen">
      <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
        <form className="font-semibold" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              className="ml-2 text-black pl-2"
              ref={username}
            />
          </div>
          <div className="flex items-center mt-2 ml-12">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
            <Link
              href="/register"
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              !Member
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
