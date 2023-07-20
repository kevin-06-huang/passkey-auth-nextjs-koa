"use client";
import useStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const store = useStore();
  const router = useRouter();
  const user = store.authUser;

  useEffect(() => {
    if (!store.authUser) {
      router.push("/login");
    }
  }, []);

  return (
    <>
      {user ? (
        <section className="bg-ct-blue-600 min-h-screen">
          <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
            <p className="text-3xl font-semibold">
              Profile of {user.username}!!!
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-ct-blue-600 min-h-screen">
          <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
            <p className="text-3xl font-semibold">Unauthorized!</p>
          </div>
        </section>
      )}
    </>
  );
}
