// pages/feedback.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function FeedbackPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (router.query.feedback) {
      setFeedback(router.query.feedback as string);
    }
  }, [router.query]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6A0DAD]/10 via-transparent to-[#00D9FF]/10 -z-10" />

      {/* Main Heading */}
      <h1
        className="text-[64px] md:text-[80px] font-bold font-sora mb-6 antialiased leading-tight
         bg-gradient-to-r from-[#6A0DAD] via-[#00D9FF] to-[#6A0DAD]
         text-transparent bg-clip-text
         drop-shadow-[0_0_20px_#6A0DAD]/70"
      >
        Mission Feedback
      </h1>

      {/* Subtitle */}
      <p className="text-[24px] font-sora text-[#F5F5F5] max-w-4xl mb-12 leading-relaxed">
        Review your mission feedback and grading results.
      </p>

      {/* Feedback Section */}
<h2
  className="text-[32px] font-bold font-sora mb-6 antialiased leading-tight
             bg-gradient-to-r from-[#6A0DAD] via-[#00D9FF] to-[#6A0DAD]
             text-transparent bg-clip-text
             drop-shadow-[0_0_20px_#6A0DAD]/70"
>
  Feedback
</h2>

<p className="whitespace-pre-wrap font-sora text-[#E0E0E0] text-[20px] leading-8 min-h-[150px]">
  {feedback || 'Loading...'}
</p>

      {/* Action Button */}
      <button
        onClick={() => router.push('/missions')}
        className="mt-12 bg-[#1C1C1E] border border-[#6A0DAD]/30 text-[#F5F5F5] font-bold text-[22px] py-4 px-12 rounded-3xl hover:scale-105 hover:border-[#6A0DAD]/50 hover:bg-[#6A0DAD]/20 transition-all duration-300 font-sora antialiased"
      >
        Back to Home
      </button>
    </div>
  );
}
