// pages/about.tsx
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamCard from "@/components/TeamCard";
import { Workflow, Circle, Triangle, Hexagon } from "lucide-react";

const About = () => {
  // Custom cursor glow effect
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-glow');
    document.body.appendChild(cursor);

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (document.body.contains(cursor)) {
        document.body.removeChild(cursor);
      }
    };
  }, []);



  return (
    <div className="bg-[#0D0D0D] text-white relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Circle 
          className="absolute top-20 left-10 text-purple-500/20 floating-element" 
          size={60} 
          fill="currentColor"
        />
        <Triangle 
          className="absolute top-1/3 right-20 text-purple-400/15 floating-element" 
          size={40}
          fill="currentColor"
        />
        <Hexagon 
          className="absolute bottom-1/4 left-1/4 text-purple-600/10 floating-element" 
          size={80}
          fill="currentColor"
        />
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-purple-300/10 rounded-full blur-xl floating-element"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-l from-purple-400/15 to-purple-600/15 rounded-lg rotate-45 floating-element"></div>
      </div>

      <Navbar />

      {/* Page Header - Edit 1: Section Spacing */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 pt-52 pb-12 text-center section-spacing relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white">
          About
        </h1>
        <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
          Resumes have been around since the 1930s. It's time for something better. <strong className="text-purple-400">Velric</strong> is redefining how the world measures talent - through real execution, not credentials. Our AI creates proof of work missions that quantify skill, consistency, and problem solving personalized for each user. The result is the <strong className="text-purple-500">Velric Score</strong>, the new global language of ability.
        </p>
      </section>

      {/* The Founders - Edit 1: Section Spacing */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-16 section-spacing relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Meet the <span className="text-purple-400 font-bold">Founders</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <TeamCard
            name="Mahir Laul (CEO)"
            role="Vision, Product, External Strategy"
            image="/assets/mahir.png"
            bio="I lead Velric's vision, product direction, and external strategy. From investor conversations to brand positioning, I make sure we're building something people remember and scaling it like a company that belongs at the top."
            linkedin="https://www.linkedin.com/in/mahir-laul-a77b11224/"
          />
          <TeamCard
            name="Sara (CTO)"
            role="AI Development, Infrastructure"
            image="/assets/CTO.png"
            bio="I lead AI development at Velric. My focus is building systems that turn professional workflows, like decks, code, and pitch, into interactive missions. I ensure our tools are fast and stable, so learners can rely on Velric to deliver real work."
            linkedin="https://www.linkedin.com/in/sara-pedron-9929271b6/"
          />
        </div>
      </section>

      {/* Our Values - Edit 3: Hover Effects */}
      <section className="bg-[#0D0D0D] py-28 px-4 md:px-8 lg:px-16 section-spacing relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Our <span className="text-purple-400 font-bold">Values</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "1. Proof Over Promises",
              subtitle: "Show it. Don't say it."
            },
            {
              title: "2. Merit Over Background", 
              subtitle: "Earn it. Don't inherit it."
            },
            {
              title: "3. Data Over Opinion",
              subtitle: "Evidence speaks louder."
            },
            {
              title: "4. Execution Defines Talent",
              subtitle: "Doers win. Talkers fade."
            },
            {
              title: "5. One Global Standard",
              subtitle: "Talent measured equally."
            },
            {
              title: "6. Built for Builders",
              subtitle: "Ambition is our language."
            }
          ].map((value) => (
            <div
              key={value.title}
              className="value-item bg-[#0D0D0D] rounded-2xl p-6 text-center shadow-md border border-[#E0E0DC]/10 min-h-[180px] flex flex-col items-center justify-center"
            >
              <h3 className="text-xl font-bold mb-2 text-purple-400">{value.title}</h3>
              <p className="text-white/80 text-sm">{value.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#0D0D0D] py-28 px-4 md:px-8 lg:px-16 section-spacing relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-16">
          Frequently Asked <span className="text-purple-400 font-bold">Questions</span>
        </h2>
        <div className="max-w-4xl mx-auto space-y-6">
          {[
            {
              question: "What is Velric?",
              answer: "Velric is a hiring platform that replaces resumes with proof of work. It measures real skills through interactive missions and project based assessments instead of traditional job applications."
            },
            {
              question: "How does the Velric Score work?",
              answer: "The Velric Score is generated by evaluating performance on tasks, efficiency, creativity, and consistency. It gives candidates a measurable score that reflects what they can actually do, not just what they list on paper."
            },
            {
              question: "Who is Velric for?",
              answer: "Velric is built for both companies and candidates. Students and professionals use it to showcase their skills, while companies use it to discover talent based on verified ability rather than background or network."
            },
            {
              question: "How can companies use Velric to hire talent?",
              answer: "Companies can post missions or challenges that mirror real work. Candidate results are automatically scored, helping hiring teams identify top performers without reading hundreds of resumes."
            },
            {
              question: "Why should I trust Velric's scoring system?",
              answer: "Velric's scoring model is backed by data and reviewed through multiple layers of validation. Every mission and result is designed to reduce bias and measure output objectively."
            },
            {
              question: "How is Velric different from other hiring platforms?",
              answer: "Velric focuses on skill over status. Instead of keywords and job titles, it ranks candidates based on how they perform in practical scenarios and live tasks."
            },
            {
              question: "Can candidates improve their Velric Score?",
              answer: "Yes. Users can retake missions, complete new ones, and build stronger profiles over time. Each activity contributes to their overall score and credibility."
            },
            {
              question: "What data does Velric use to generate scores?",
              answer: "Velric analyzes user submitted tasks, completion speed, accuracy, creativity, and collaboration metrics to calculate a dynamic skill score."
            },
            {
              question: "Does Velric replace resumes completely?",
              answer: "Velric aims to move beyond resumes by providing a transparent way to measure skill. Some companies may still request resumes, but the Velric Score is often enough to demonstrate capability."
            },
            {
              question: "How does Velric ensure fairness in hiring?",
              answer: "Velric anonymizes submissions and standardizes scoring criteria so evaluations focus purely on skill and performance, not background or personal details."
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-[#1C1C1E] rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-purple-400 mb-3">
                {index + 1}. {faq.question}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;