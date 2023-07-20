import Image from 'next/image';

export default function Home() {
  return (
    <section className="bg-orange-600 min-h-screen">
      <div className="max-w-4xl mx-auto bg-pink rounded-md h-[20rem] flex flex-col justify-center items-center">
        <p className="text-3xl font-semibold mt-64 font-comic">PASSKEY</p>
        <div className="mt-4 rounded-lg">
          <Image
            src="/anime-sunset.avif"
            width={500}
            height={500}
            alt="Picture of the author"
          />
        </div>
      </div>
    </section>
  );
}
