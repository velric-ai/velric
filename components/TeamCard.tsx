// components/TeamCard.tsx
import Image from "next/image";

type Props = {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin: string;
};

export default function TeamCard({ name, role, image, bio, linkedin }: Props) {
  return (
    <div className="bg-[#1C1C1E] text-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300 ease-in-out">
      <Image
        src={image}
        alt={name}
        width={150}
        height={150}
        className="rounded-full mx-auto"
      />
      <h3 className="text-xl font-semibold mt-4 text-center">{name}</h3>
      <p className="text-sm text-gray-400 text-center mb-2">{role}</p>
      <p className="text-gray-300 text-sm mt-2">{bio}</p>

      <div className="mt-6 flex justify-center">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md"
        >
          View LinkedIn
        </a>
      </div>
    </div>
  );
}
