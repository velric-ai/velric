import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  interest: string;
};

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    interest: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const scriptURL = "https://script.google.com/macros/s/AKfycbyrY4MO68paGjqI3UWRgeHt9jLA-xNk4AMlbDutnnUBg8Bwq0V4s-kk_QgJf-_sc9H-qQ/exec"; // Replace URL

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });

      setSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error!", error.message);
      } else {
        console.error("Unexpected error!", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0D0D0D] text-white p-6 rounded-2xl max-w-xl mx-auto space-y-4 shadow-lg"
    >
      {submitted ? (
        <p className="text-center text-lg">You're in. Expect updates soon.</p>
      ) : (
        <>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-black border border-gray-600"
            required
          />
          <select
            name="interest"
            value={formData.interest}
            onChange={handleChange}
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
