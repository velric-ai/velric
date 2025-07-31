type Props = {
  name: string;
  quote: string;
  company?: string;
};

export default function TestimonialCard({ name, quote, company }: Props) {
  return (
    <div className="bg-[#1C1C1E] text-white p-6 rounded-2xl shadow-md">
      <p className="text-sm italic text-gray-300 mb-4">"{quote}"</p>
      <p className="text-white font-semibold">{name}</p>
      {company && <p className="text-xs text-gray-400">{company}</p>}
    </div>
  );
}
