import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { ElementType } from 'react';

type Props = {
  icon: keyof typeof LucideIcons;
  title: string;
  description: string;
  className?: string;
};

export default function ValuePropCard({
  icon,
  title,
  description,
  className = "",
}: Props) {
  const LucideIcon = LucideIcons[icon] as ElementType<LucideProps>;

  return (
    <div
      className={`bg-[#1C1C1E] text-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 ease-in-out text-center ${className}`}
    >
      <LucideIcon className="w-14 h-14 mb-4 mx-auto text-white" strokeWidth={1.5} />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
