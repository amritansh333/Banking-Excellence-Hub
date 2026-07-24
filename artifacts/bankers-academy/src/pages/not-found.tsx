import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home, ArrowLeft, TrendingUp } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found — The Bankers Academy LLP";
  }, []);
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-white max-w-2xl"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#C89B3C]/20 border border-[#C89B3C]/30 flex items-center justify-center mx-auto mb-6">
          <TrendingUp className="text-[#C89B3C]" size={36} />
        </div>

        {/* 404 */}
        <div
          className="font-bold text-8xl mb-2 text-[#C89B3C] opacity-70"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          404
        </div>

        {/* Motivational headline */}
        <h1
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          Every Setback is a Setup for a Comeback
        </h1>

        {/* Encouraging copy — simple Indian English */}
        <p
          className="text-blue-100 text-lg leading-relaxed mb-4 max-w-xl mx-auto"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          This page could not be found — but that is okay. This small error is
          temporary. The same way a wrong turn does not stop a determined person
          from reaching their destination, this is just a small detour.
        </p>
        <p
          className="text-blue-200 text-base leading-relaxed mb-7 max-w-lg mx-auto"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          The biggest names in private banking also faced wrong turns,
          rejections, and setbacks. What made them successful was that they kept
          going. So let us go back and keep moving forward.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-7">
          <Link href="/">
            <button
              className="inline-flex items-center px-6 py-3 bg-[#C89B3C] hover:bg-[#b8892e] text-white font-semibold text-sm rounded transition-colors"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Home className="mr-2" size={16} /> Go to Home
            </button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-white/40 text-white hover:bg-white/10 font-semibold text-sm rounded transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <ArrowLeft className="mr-2" size={16} /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="border-t border-white/10 pt-8">
          <p
            className="text-blue-300 text-xs uppercase tracking-widest mb-4 font-semibold"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Where Would You Like to Go?
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-sm">
            {[
              { label: "Our Courses", href: "/courses" },
              { label: "What We Do", href: "/program" },
              { label: "Enquiry", href: "/enquiry" },
              { label: "Contact Us", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-blue-200 hover:text-white transition-colors"
                style={{ fontFamily: "'Open Sans', sans-serif" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
