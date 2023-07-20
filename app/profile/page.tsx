"use client";
import useStore from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from 'next/image';

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
        <section className="bg-orange-600 min-h-screen flex justify-center">
          <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex-col justify-center items-center mt-10">
            <p className="text-3xl font-semibold font-comic">
              Profile of {user.username}!!!
            </p>
            <div className="mt-4 rounded-lg">
              <Image
                src="/anime-1.jpeg"
                width={300}
                height={300}
                alt="Picture of the author"
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-ct-blue-600 min-h-screen">
          <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
            <p className="text-3xl font-semibold font-comic">Unauthorized!</p>
          </div>
        </section>
      )}
    </>
  );
}
