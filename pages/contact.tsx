import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Circle, Triangle, Hexagon, Clock, Users, MessageSquare } from "lucide-react";

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea';
}

const Field: React.FC<FieldProps> = ({ 
  label, 
  name, 
  type = "text", 
  placeholder, 
  required = false,
  as = 'input'
}) => {
  const Component = as;
  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">
        {label} {required && '*'}
      </label>
      <Component
        name={name}
        type={as === 'input' ? type : undefined}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[#2A2A2E] border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
        rows={as === 'textarea' ? 4 : undefined}
      />
    </div>
  );
};

const RequestDemo = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor-glow");
    document.body.appendChild(cursor);
    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    document.addEventListener("mousemove", move);
    return () => {
      document.removeEventListener("mousemove", move);
      if (document.body.contains(cursor)) document.body.removeChild(cursor);
    };
  }, []);

  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#0D0D0D] text-white relative overflow-hidden min-h-screen">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Circle className="absolute top-20 left-10 text-purple-500/20 floating-element" size={60} fill="currentColor" />
        <Triangle className="absolute top-1/3 right-20 text-purple-400/15 floating-element" size={40} fill="currentColor" />
        <Hexagon className="absolute bottom-1/4 left-1/4 text-purple-600/10 floating-element" size={80} fill="currentColor" />
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-gradient-to-r from-purple-500/10 to-purple-300/10 rounded-full blur-xl floating-element"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-gradient-to-l from-purple-400/15 to-purple-600/15 rounded-lg rotate-45 floating-element"></div>
      </div>

      <Navbar />

      {/* Main Content */}
      <section className="pt-32 pb-20 px-4 md:px-8 lg:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                  Schedule Your<br />
                  <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Velric Demo</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  See how AI-powered missions transform hiring in minutes
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Get a personalized walkthrough of Velric's AI-powered assessment platform, learn how real-world missions evaluate actual skills, and discover why leading companies choose Velric for hiring.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white font-medium">15-minute demo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">Live walkthrough</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white font-medium">Custom use cases</span>
                </div>
              </div>


            </div>

            {/* Right Side - Form */}
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2A1A3A] rounded-2xl border border-purple-500/20 p-8">
                {submitted ? (
                  <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold mb-2">Request received</h2>
                    <p className="text-white/70">We'll email you shortly to schedule your demo.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">Get Your Demo</h2>
                    <p className="text-gray-400 mb-8">Fill out the form below and we'll schedule a personalized walkthrough of Velric.</p>
                    
                    <form
                      className="space-y-6"
                      method="POST"
                      action="/api/demo" 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setSubmitted(true);
                      }}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="First Name" name="firstName" placeholder="Ada" required />
                        <Field label="Last Name" name="lastName" placeholder="Lovelace" required />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Work Email" name="email" type="email" placeholder="your@email.com" required />
                        <Field label="Job Title" name="jobTitle" placeholder="Hiring Manager" required />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Company Name" name="company" placeholder="Your Company" required />
                        <div>
                          <label className="block text-sm text-white/70 mb-2">Company Size *</label>
                          <select
                            name="companySize"
                            className="w-full bg-[#2A2A2E] border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                            required
                            title="Select company size"
                            aria-label="Company Size"
                          >
                            <option value="">Select company size...</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-1000">201-1000 employees</option>
                            <option value="1000+">1000+ employees</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm text-white/70 mb-2">Country *</label>
                          <select
                            name="country"
                            className="w-full bg-[#2A2A2E] border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                            required
                            title="Select country"
                            aria-label="Country"
                          >
                            <option value="">United States</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="AU">Australia</option>
                            <option value="JP">Japan</option>
                            <option value="SG">Singapore</option>
                            <option value="IN">India</option>
                            <option value="BR">Brazil</option>
                            <option value="MX">Mexico</option>
                            <option value="NL">Netherlands</option>
                            <option value="SE">Sweden</option>
                            <option value="NO">Norway</option>
                            <option value="DK">Denmark</option>
                            <option value="FI">Finland</option>
                            <option value="CH">Switzerland</option>
                            <option value="AT">Austria</option>
                            <option value="BE">Belgium</option>
                            <option value="ES">Spain</option>
                            <option value="IT">Italy</option>
                            <option value="PT">Portugal</option>
                            <option value="IE">Ireland</option>
                            <option value="NZ">New Zealand</option>
                            <option value="ZA">South Africa</option>
                            <option value="IL">Israel</option>
                            <option value="KR">South Korea</option>
                            <option value="TW">Taiwan</option>
                            <option value="HK">Hong Kong</option>
                            <option value="TH">Thailand</option>
                            <option value="MY">Malaysia</option>
                            <option value="PH">Philippines</option>
                            <option value="ID">Indonesia</option>
                            <option value="VN">Vietnam</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <Field label="Phone Number" name="phone" type="tel" placeholder="(123) 456-7891" />
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-2">What interests you most about Velric? *</label>
                        <select
                          name="interest"
                          className="w-full bg-[#2A2A2E] border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                          required
                          title="Select your primary interest"
                          aria-label="Primary Interest"
                        >
                          <option value="">What interests you most?</option>
                          <option value="candidate-assessment">Candidate Assessment & Evaluation</option>
                          <option value="hiring-efficiency">Improving Hiring Efficiency</option>
                          <option value="skill-validation">Skills-Based Hiring & Validation</option>
                          <option value="ai-powered-screening">AI-Powered Candidate Screening</option>
                          <option value="reducing-bias">Reducing Hiring Bias</option>
                          <option value="technical-interviews">Technical Interview Process</option>
                          <option value="talent-pipeline">Building Talent Pipeline</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Field 
                          label="Additional Details" 
                          name="details" 
                          placeholder="Tell us more about your hiring needs or what you'd like to learn about Velric..." 
                          as="textarea"
                        />
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="marketing-consent"
                          name="marketingConsent"
                          className="mt-1 w-4 h-4 text-purple-600 bg-[#2A2A2E] border-purple-500/20 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <label htmlFor="marketing-consent" className="text-sm text-gray-400">
                          I agree to receive marketing communications about Velric and related services.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1C1C1E]"
                      >
                        ✓ Request Demo
                      </button>

                      <p className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our{" "}
                        <a href="/privacy" className="text-purple-400 hover:text-purple-300">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="/terms" className="text-purple-400 hover:text-purple-300">
                          Terms of Service
                        </a>
                        .
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestDemo;