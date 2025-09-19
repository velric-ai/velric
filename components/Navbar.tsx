// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black z-50 shadow-md px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center md:flex-row md:justify-between gap-4">
        {/* Logo (hidden on small screens) */}
        <div className="hidden md:block">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Velric Logo"
              width={120}
              height={40}
            />
          </Link>
        </div>

        {/* Menu links */}
        <div className="flex justify-center gap-6 text-white font-medium text-sm sm:text-base flex-wrap w-full md:w-auto">
          <Link href="/" className="whitespace-nowrap">Home</Link>
          <Link href="/about" className="whitespace-nowrap">About</Link>
          <Link href="/join" className="whitespace-nowrap">Join</Link>
          <Link href="/contact" className="whitespace-nowrap">Contact</Link>
          <Link href="/generate" className="whitespace-nowrap">Missions</Link>
        </div>

        {/* Join button */}
        <div className="w-full md:w-auto flex justify-center md:justify-end mt-3 md:mt-0">
          <Link href="/join">
            <button className="bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white px-4 py-2 text-sm sm:text-base rounded-full hover:scale-105 transition whitespace-nowrap w-full max-w-xs md:w-auto">
              Join Early Access
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
