import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Phone, Mail, MapPin, CheckCircle, Send, User, BookOpen, MessageSquare } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const whyEnquire = [
  { icon: CheckCircle, text: "Free career counselling call — no obligation" },
  { icon: CheckCircle, text: "Know exactly if this program is right for you" },
  { icon: CheckCircle, text: "Get fee, batch date & seat availability details" },
  { icon: CheckCircle, text: "Talk directly to someone who has worked in private banking" },
];

const faqs = [
  { q: "How soon will someone call me back?", a: "Our counselling team will call you within 24 working hours of receiving your enquiry." },
  { q: "Is there any fee for counselling?", a: "Absolutely not. The counselling call is completely free. We want you to make the right decision for your career first." },
  { q: "What if I am not sure this program is for me?", a: "That is exactly why you should call. Our counsellors will understand your background and honestly tell you whether this program will benefit you." },
  { q: "Can a working professional apply?", a: "Yes. Many of our students are working professionals who want to switch to private banking or grow within the financial sector. We have helped many make this transition successfully." },
];

export default function Enquiry() {
  useEffect(() => {
    document.title = "Enquiry — The Bankers Academy LLP";
  }, []);

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", qualification: "", city: "", interest: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          courseInterest: [formData.qualification, formData.city, formData.interest].filter(Boolean).join(" / ") || null,
          message: formData.message || null,
          sourcePage: "/enquiry",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit enquiry.");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="hero-gradient py-9 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center text-white space-y-4 max-w-3xl mx-auto">
            <motion.span variants={fadeUp} className="inline-block px-3 py-1 rounded bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-semibold tracking-widest uppercase">
              Take the First Step
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Your Private Banking Career Starts with<br />One Conversation
            </motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Fill in your details below and our team will call you back — free of charge. No sales pressure, just honest career guidance from people who have lived in the private banking industry.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50L1440 50L1440 0C1200 33 960 50 720 50C480 50 240 33 0 0L0 50Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-7 max-w-6xl mx-auto">

            {/* Left — Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0B1F4D] mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Thank You! We Will Call You Soon.
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    Your enquiry has been received. Our career counselling team will call you within 24 working hours.
                  </p>
                  <p className="text-gray-500 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    Remember — this one call could be the beginning of the career you have always wanted. We are excited to speak with you.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-5 py-2.5 border border-[#0B1F4D] text-[#0B1F4D] text-sm font-semibold rounded hover:bg-[#0B1F4D] hover:text-white transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-[#0B1F4D] px-6 py-4">
                    <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Raleway', sans-serif" }}>Enquiry Form</h2>
                    <p className="text-blue-200 text-sm mt-0.5" style={{ fontFamily: "'Open Sans', sans-serif" }}>Fill in your details — our team will get in touch within 24 hours</p>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text" name="name" required value={formData.name} onChange={handleChange}
                            placeholder="Your full name"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-800"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-800"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Email Address</label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            placeholder="your@email.com"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-800"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>City / Location</label>
                        <div className="relative">
                          <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text" name="city" value={formData.city} onChange={handleChange}
                            placeholder="Your city"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-800"
                            style={{ fontFamily: "'Open Sans', sans-serif" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Highest Qualification</label>
                        <select
                          name="qualification" value={formData.qualification} onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-700 bg-white"
                          style={{ fontFamily: "'Open Sans', sans-serif" }}
                        >
                          <option value="">Select qualification</option>
                          <option>12th Pass</option>
                          <option>Graduate (B.Com / BA / BBA / BSc / Other)</option>
                          <option>Post Graduate</option>
                          <option>Currently in Final Year</option>
                          <option>Working Professional</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          <BookOpen size={13} className="inline mr-1" />
                          I Am Interested In
                        </label>
                        <select
                          name="interest" value={formData.interest} onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-700 bg-white"
                          style={{ fontFamily: "'Open Sans', sans-serif" }}
                        >
                          <option value="">Select your interest</option>
                          <option>Private Banking & Finance Excellence Program</option>
                          <option>Career Guidance in Private Banking</option>
                          <option>NBFC & Insurance Sector</option>
                          <option>General Information</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#0B1F4D] text-sm font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <MessageSquare size={13} className="inline mr-1" />
                        Tell Us About Yourself (Optional)
                      </label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange}
                        rows={3}
                        placeholder="Any specific questions, your current situation, or what you are hoping this program will do for your career..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#0B1F4D] text-gray-800 resize-none"
                        style={{ fontFamily: "'Open Sans', sans-serif" }}
                      />
                    </div>

                    <div className="bg-[#f5f7fb] border border-gray-100 rounded p-4">
                      <p className="text-gray-600 text-xs leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                        <strong className="text-[#0B1F4D]">You are not committing to anything.</strong> This is just a conversation. Our counsellor will understand your situation and honestly guide you — whether that means joining TBA or not.
                      </p>
                    </div>

                    {error && (
                      <p className="text-red-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-[#0B1F4D] hover:bg-[#0d2455] disabled:opacity-60 text-white font-bold text-sm rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      <Send size={16} />
                      {submitting ? "Submitting…" : "Submit My Enquiry — Call Me Back"}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Right — Info Panel */}
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-[#0B1F4D] text-base mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Why Enquire With Us?
                </h3>
                <div className="space-y-3">
                  {whyEnquire.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3">
                      <Icon size={15} className="text-[#C89B3C] shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0B1F4D] rounded-lg p-5 text-white">
                <h3 className="font-bold text-base mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Prefer to Call Directly?</h3>
                <p className="text-blue-200 text-sm mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>Mon – Sat, 9 AM to 6 PM</p>
                <a href="tel:+916306286395" className="flex items-center gap-2 text-[#C89B3C] font-bold text-lg hover:text-[#d4aa50] transition-colors" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  <Phone size={18} />
                  +91-6306286395
                </a>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <a href="mailto:admissions@thebankersacademy.org" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    <Mail size={14} />
                    admissions@thebankersacademy.org
                  </a>
                </div>
              </div>

              <div className="bg-[#f5f7fb] border border-gray-200 rounded-lg p-5">
                <h3 className="font-bold text-[#0B1F4D] text-sm mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  What Happens After You Enquire?
                </h3>
                {[
                  { n: "1", t: "We call you back", d: "Within 24 working hours" },
                  { n: "2", t: "Free counselling session", d: "15–20 mins to understand your goals" },
                  { n: "3", t: "Honest guidance", d: "We tell you exactly what is right for you" },
                  { n: "4", t: "Your decision", d: "No pressure. No rush. It is your career." },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex items-start gap-3 mb-3 last:mb-0">
                    <div className="w-6 h-6 rounded-full bg-[#0B1F4D] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {n}
                    </div>
                    <div>
                      <div className="text-[#0B1F4D] text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{t}</div>
                      <div className="text-gray-500 text-xs" style={{ fontFamily: "'Open Sans', sans-serif" }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="mb-7">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Before You Enquire</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0B1F4D] mt-2" style={{ fontFamily: "'Raleway', sans-serif" }}>Commonly Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="border border-gray-200 rounded-lg p-5 bg-[#f8fafc]">
                <h4 className="font-semibold text-[#0B1F4D] text-sm mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{q}</h4>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOTIVATIONAL STRIP ── */}
      <section className="bg-[#0B1F4D] py-9">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-[#C89B3C] text-xs font-semibold tracking-widest uppercase mb-3" style={{ fontFamily: "'Open Sans', sans-serif" }}>Remember This</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 max-w-2xl mx-auto" style={{ fontFamily: "'Raleway', sans-serif" }}>
            "The best time to start your private banking career was yesterday. The second best time is today."
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            Thousands of students just like you have made this call and changed the direction of their life. 
            Your turn. Fill the form above and take that first step.
          </p>
        </div>
      </section>
    </div>
  );
}
