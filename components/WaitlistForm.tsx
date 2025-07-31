import { useState } from "react";

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      action="https://usebasin.com/f/ce65b3daae17" //REPLACE FORM LINK HERE!
      method="POST"
      onSubmit={() => setSubmitted(true)}
      className="bg-[#1C1C1E] text-white p-6 rounded-2xl max-w-xl mx-auto space-y-4 shadow-lg"
    >
      {submitted ? (
        <p className="text-center text-lg">You're in. Expect updates soon.</p>
      ) : (
        <>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="w-full p-3 rounded-md bg-black border border-gray-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-md bg-black border border-gray-600"
            required
          />

          <select
            name="interest_area"
            className="w-full p-3 rounded-md bg-black border border-gray-600"
            required
          >
            <option value="">Area of Interest</option>
            <option value="ai">AI & Machine Learning</option>
            <option value="engineering">Software Engineering</option>
            <option value="design">Product & UX Design</option>
            <option value="data">Data Science & Analytics</option>
            <option value="marketing">Marketing & Growth</option>
            <option value="strategy">Business Strategy</option>
            <option value="product">Product Management</option>
            <option value="founder">Founders & Startups</option>
            <option value="investing">VC & Investing</option>
            <option value="operations">Operations & Systems</option>
            <option value="writing">Content & Technical Writing</option>
            <option value="education">Learning & EdTech</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg w-full"
          >
            Join Now
          </button>
        </>
      )}
    </form>
  );
}
