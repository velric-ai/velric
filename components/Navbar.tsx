// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black z-50 shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <Image src="/assets/logo.png" alt="Velric Logo" width={120} height={40} />
      </Link>
      <div className="space-x-6 hidden md:flex text-white font-medium">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/join">Join</Link>
        <Link href="/contact">Contact</Link>
      </div>
      <Link href="/join">
        <button className="bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white px-4 py-2 rounded-full hover:scale-105 transition">
          Join Early Access
        </button>
      </Link>
    </nav>
  );
}
