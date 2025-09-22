import React, { useState } from "react";

const SubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
      <div className="bg-[#1C1C1E] rounded-2xl p-8 md:p-12 shadow-2xl border border-[#6A0DAD]/20 hover:scale-105 transition-all duration-300 hover:shadow-[#6A0DAD]/20 hover:shadow-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[50px] font-bold font-sora text-white mb-4 antialiased">
            Mission Submission
          </h1>
          <p className="text-[18px] text-[#F5F5F5] font-inter max-w-2xl mx-auto">
            Submit your mission details and files to join our community of
            innovators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mission Title */}
          <div className="space-y-3">
            <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
              Mission Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your mission title"
              required
              className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] placeholder-[#F5F5F5]/60 text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50"
            />
          </div>

          {/* Mission Description */}
          <div className="space-y-3">
            <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
              Mission Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your mission in detail..."
              rows={6}
              required
              className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] placeholder-[#F5F5F5]/60 text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
              Upload Supporting Files
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-[#6A0DAD]/30 rounded-2xl p-8 text-center hover:border-[#6A0DAD]/50 hover:bg-[#6A0DAD]/5 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#6A0DAD] to-[#00D9FF] rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[18px] text-[#F5F5F5] font-inter">
                      {formData.file
                        ? formData.file.name
                        : "Click to upload files"}
                    </p>
                    <p className="text-[14px] text-[#F5F5F5]/60 font-inter mt-2">
                      PDF, DOC, TXT, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Email */}
            <div className="space-y-3">
              <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                required
                className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] placeholder-[#F5F5F5]/60 text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50"
              />
            </div>

            {/* Priority Level */}
            <div className="space-y-3">
              <label className="block text-[18px] font-semibold text-[#F5F5F5] font-inter">
                Priority Level
              </label>
              <select className="w-full px-6 py-4 bg-[#0D0D0D] border border-[#6A0DAD]/30 rounded-2xl text-[#F5F5F5] text-[18px] font-inter focus:border-[#6A0DAD] focus:ring-2 focus:ring-[#6A0DAD]/20 focus:outline-none transition-all duration-300 hover:border-[#6A0DAD]/50">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6A0DAD] to-[#00D9FF] text-white font-bold text-[18px] py-4 px-8 rounded-2xl hover:scale-105 hover:shadow-[#6A0DAD]/30 hover:shadow-2xl transition-all duration-300 font-sora antialiased"
            >
              Submit Mission
            </button>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4">
            <p className="text-[14px] text-[#F5F5F5]/60 font-inter">
              By submitting, you agree to our terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;
