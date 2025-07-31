import CTAButton from "./CTAButton";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-[#0D0D0D] text-white text-center px-6 pt-20">
      <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
        <span className="block">Real Work.</span>
        <span className="block">Real Skills.</span>
        <span className="block">Real Results.</span>
      </h1>
      <p className="text-lg md:text-2xl max-w-2xl mt-4 text-gray-300">
        AI-powered challenges built from actual work done by top professionals.
      </p>
      <div className="mt-8">
        <CTAButton />
      </div>
    </section>
  );
}
