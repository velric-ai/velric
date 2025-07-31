type Props = {
  icon: string;
  title: string;
  description: string;
};

export default function ValuePropCard({ icon, title, description }: Props) {
  return (
    <div className="bg-[#1C1C1E] text-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 ease-in-out">
      <img
        src={icon}
        alt={title}
        className="w-12 h-12 mb-4 mx-auto"
        loading="lazy"
      />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
}
