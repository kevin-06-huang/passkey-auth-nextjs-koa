"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/store/auth";
import { useRef } from "react";

export default function Login() {
  const router = useRouter();
  const store = useStore();
  const username = useRef<HTMLInputElement>(null);
  const handleSubmit = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const res = fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.current!.value,
        }),
      });
      const resBody = await (await res).json();
      if (!resBody.status) {
        store.setAuthUser(resBody);
        if (resBody.otp_enabled) router.push("/validateOtp");
        else router.push("/profile");
      } else alert(resBody.status);
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
