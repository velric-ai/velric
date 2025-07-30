// components/CTAButton.tsx
import Link from 'next/link';

export default function CTAButton() {
  return (
    <Link href="/join">
      <button className="bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg">
        Join Early Access
      </button>
    </Link>
  );
}
