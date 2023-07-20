import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Navbar"));

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Passkey Next.js Demo",
  description: "Passkey demo in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between p-6 bg-red-600">
          <Navbar />
        </div>
        {children}
      </body>
    </html>
  );
}
