import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Award, Users, Briefcase, TrendingUp, BookOpen, Target, Mic2, Shield,
  ChevronRight, CheckCircle, ArrowRight, Phone, MapPin, Mail,Volume2, VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroVideo from "@/attached_assets/TBA Hero Video.mp4";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const fadeIn: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const trustedPartners = [
  "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "SBI",
  "Yes Bank", "Bajaj Finance", "Muthoot Finance", "LIC", "HDFC Life",
  "Aditya Birla Capital", "PNB Housing Finance", "IDFC First Bank", "IndusInd Bank"
];

const whyChooseUs = [
  { icon: Award, title: "Industry Expert Faculty", desc: "Our trainers are experienced private banking professionals — not just educators. Every session reflects real-world private banking practice." },
  { icon: BookOpen, title: "Practical Training", desc: "Role-plays, live case studies, and simulated private banking environments prepare you for your first day at work." },
  { icon: TrendingUp, title: "Current Curriculum", desc: "The curriculum is regularly updated to reflect RBI guidelines, market trends, and current employer expectations." },
  { icon: Briefcase, title: "Placement Assistance", desc: "A dedicated placement cell with 20+ partner organisations runs regular drives throughout and after the program." },
  { icon: Mic2, title: "Interview Preparation", desc: "Multiple mock interview rounds and group discussion sessions to sharpen communication and build confidence." },
  { icon: Target, title: "Career Mentorship", desc: "One-on-one mentorship from industry veterans to guide you on career paths, growth strategies, and skill development." }
];

const processSteps = [
  { step: "01", title: "Registration", desc: "Submit your application online. Our team responds within 24 hours." },
  { step: "02", title: "Counselling", desc: "A career counsellor assesses your background and guides you through the program." },
  { step: "03", title: "Training", desc: "2-month intensive classroom and practical training with industry faculty." },
  { step: "04", title: "Skill Building", desc: "Communication, digital private banking tools, and sector-specific skill workshops." },
  { step: "05", title: "Mock Interviews", desc: "Multiple mock interview rounds and GD practice with industry panellists." },
  { step: "06", title: "Placement", desc: "Placement drives with 20+ partner private banks, NBFCs, and insurance companies." }
];

const SHOW_FINANCIAL_INSTITUTIONS_SECTION = false;

const faqs = [
  { q: "What is the duration of the program?", a: "The Private Banking & Finance Excellence Program is a 2-month full-time intensive program. Classes run 5 days a week with practical sessions built into the schedule." },
  { q: "What is the eligibility criteria?", a: "Any graduate or final-year student is eligible. We also welcome working professionals looking to transition into private banking and finance. No prior private banking experience is required." },
  { q: "What does placement assistance include?", a: "Our placement cell arranges drives with 20+ partner organisations. We provide resume building, interview coaching, mock interviews, and referrals through our hiring network." },
  { q: "Is training online or in-person?", a: "Training is classroom-based. We believe in-person learning is essential for developing the communication and professional skills demanded by the private banking sector." },
  { q: "Will I receive a certificate?", a: "Yes. All students who complete the program receive a Certificate of Completion recognised by our hiring partner organisations." },
  { q: "How is this different from other coaching institutes?", a: "We are not a coaching institute. Our faculty are active and retired private banking professionals. We prepare students not just to get a job but to build a long-term career in private banking and finance." },
];

export default function Home() {
  useEffect(() => {
    document.title = "The Bankers Academy LLP — Institute of Private Banking Excellence";
  }, []);

  // ===== VIDEO CONTROLS =====
  const videoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;

    const nextMuted = !muted;

    videoRef.current.muted = nextMuted;

    if (!nextMuted) {
      videoRef.current.play();
    }

    setMuted(nextMuted);
  };
  // ==========================

  const aboutRef = useRef(null);
  const whyRef = useRef(null);
  const processRef = useRef(null);
  const statsRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, margin: "-60px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-60px" });
  const processInView = useInView(processRef, { once: true, margin: "-60px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-60px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[88svh] lg:min-h-screen">

        {/* Background Video */}
        <motion.video
          ref={videoRef}
          autoPlay
          loop
          muted={muted}
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          preload="auto"
          initial={{
            opacity: 0,
            scale: 1.12,
          }}
          animate={{
            opacity: 1,
            scale: [1.12, 1.04, 1.12],
          }}
          transition={{
            opacity: { duration: 1.5 },
            scale: {
              duration: 22,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          className="absolute inset-0 w-full h-full object-cover object-center md:object-center lg:object-center scale-110 md:scale-105lg"
        >
          <source src={heroVideo} type="video/mp4" />
        </motion.video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#071938]/65 lg:bg[#071938]/40"></div>

        {/* Left Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071938]/90 via-[#071938]/45 to-transparent"></div>

        {/* Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        {/* Gold Glow */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[#C89B3C]/15 blur-[220px]" />

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-10 lg:pt-8 lg:pb-16 grid lg:grid-cols-[58%_42%] gap-8 items-center">
          {/* Left copy */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-white space-y-6">
            <motion.div variants={fadeUp}>
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] rounded uppercase tracking-wider mb-4">
                Institute of Private Banking Excellence
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight text-white">
                Build a Rewarding Career in<br />
                <span className="text-[#C89B3C]">Private Banking, Finance & NBFCs</span>
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} className="text-blue-100 text-[15px]sm:text-base lg:text-lg leading-7 max-w-lg" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Industry-led training, recruitment & placement programs designed by experienced private banking professionals. Preparing students to survive, thrive, and career in the financial sector.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-2">
              {["2-Month Intensive Full-Time Program", "Our faculty are ex-senior private banking professionals", "20+ Organizations across Private Banks & NBFCs", "100% Placement Assistance Rate"].map(item => (
                <motion.li key={item} variants={fadeUp} className="flex items-center gap-2 text-blue-100 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  <CheckCircle size={15} className="text-[#C89B3C] shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-0">
              <Link href="/program">
                <button className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 bg-[#C89B3C] hover:bg-[#b8892e] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  View Program <ArrowRight className="ml-2" size={16} />
                </button>
              </Link>
              <Link href="/admission">
                <button className="inline-flex items-center justify-center w-full sm:w-auto px-7 py-3.5 border-2 border-white/50 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Apply Now
                </button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-2 pt-2">
              <a href="tel:+916306286395" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                <Phone size={14} className="text-[#C89B3C]" />
                Call us: +91-6306286395
              </a>
            </motion.div>
            <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-4 pt-2"
            >

            <div className="flex items-center gap-2 text-blue-100 text-sm">
            ⭐ 1000+ Careers Built
            </div>

            <div className="flex items-center gap-2 text-blue-100 text-sm">
            🏦 20+ Hiring Partners
            </div>

            <div className="flex items-center gap-2 text-blue-100 text-sm">
            🎓 Industry Faculty
            </div>

            </motion.div>
          </motion.div>
          {/* Right — program info card */}
          <motion.div
          className="lg:max-w-md w-full lg:ml-16"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
            >
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              {/* Card header */}
              <div className="bg-[#0B1F4D] px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#C89B3C]/20 flex items-center justify-center">
                    <BookOpen className="text-[#C89B3C]" size={20} />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>Private Banking & Finance Excellence Program</div>
                    <div className="text-blue-200 text-xs">Flagship 2-Month Program</div>
                  </div>
                </div>
              </div>
              {/* Card body */}
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Duration", value: "2 Months" },
                    { label: "Mode", value: "Full-Time" },
                    { label: "Eligibility", value: "Any Graduate" },
                    { label: "Certification", value: "Recognised" }
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 border border-gray-100 rounded p-3">
                      <div className="text-gray-500 text-xs" style={{ fontFamily: "'Open Sans', sans-serif" }}>{label}</div>
                      <div className="font-semibold text-[#0B1F4D] text-sm mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sectors Covered</div>
                  <div className="flex flex-wrap gap-2">
                    {["Private Banking", "NBFCs", "Insurance", "Operations", "Digital Private Banking"].map(s => (
                      <span key={s} className="px-2 py-1 bg-[#0B1F4D]/5 border border-[#0B1F4D]/10 text-[#0B1F4D] text-xs rounded font-medium" style={{ fontFamily: "'Open Sans', sans-serif" }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[{ n: "1000+", l: "Placed" }, { n: "100%", l: "Rate" }, { n: "20+", l: "Organizations" }].map(({ n, l }) => (
                      <div key={l}>
                        <div className="text-[#C89B3C] font-bold text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>{n}</div>
                        <div className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "'Open Sans', sans-serif" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/program">
                  <button className="w-full py-3 bg-[#0B1F4D] hover:bg-[#0d2455] text-white text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    View Full Program Details →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="absolute top-24 right-4 lg:top-8 lg:right-8 z-40 flex items-center justify-center w-11 h-11 lg:w-auto lg:h-auto lg:px-4 lg:py-3 lg:gap-2 rounded-full bg-black/35 backdrop-blur-xl border border-white/20 text-white transition-all duration-300 hover:bg-black/50 cursor-pointer"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          <span className="hidden lg:inline text-sm">
            {muted ? "Sound Off" : "Sound On"}
          </span>
        </button>
        {/* Hero Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:block z-20">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-6 h-10 border border-white/40 rounded-full flex justify-center"
          >
            <div className="w-1 h-2 rounded-full bg-white mt-2" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section ref={statsRef} className="bg-[#0B1F4D] border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <motion.div initial="hidden" animate={statsInView ? "visible" : "hidden"} variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-x divide-white/10">
            {[
              { target: 40, suffix: "+", label: "Years Combined Faculty Experience" },
              { target: 2000, suffix: "+", label: "Skilled Professionals Required" },
              { target: 20, suffix: "+", label: "Organizations across Private Banks & NBFCs" },
              { target: 100, suffix: "%", label: "Placement Assistance Rate" }
            ].map(({ target, suffix, label }, i) => (
              <motion.div key={label} variants={fadeUp} className={`text-center text-white ${i > 0 ? "pl-6" : ""}`}>
                <div className="text-5xl font-bold text-[#C89B3C]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  <AnimatedCounter target={target} suffix={suffix} />
                </div>
                <div className="text-blue-200 text-sm mt-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TRUSTED BY (Financial Institutions) — currently hidden. Flip SHOW_FINANCIAL_INSTITUTIONS_SECTION above to true to bring it back. ── */}
      {SHOW_FINANCIAL_INSTITUTIONS_SECTION && (
        <section className="py-8 bg-white border-b border-gray-100 overflow-hidden">
          <div className="container mx-auto px-4 mb-5 text-center">
            <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Our students work at leading financial institutions</p>
          </div>
          <div className="relative">
            <div className="flex items-center gap-7 animate-[scroll_28s_linear_infinite]" style={{ width: "max-content" }}>
              {[...trustedPartners, ...trustedPartners].map((p, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0 px-5 py-2 rounded bg-white border border-gray-200 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-[#0B1F4D]/10 flex items-center justify-center text-[#0B1F4D] font-bold text-xs">{p[0]}</div>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap" style={{ fontFamily: "'Open Sans', sans-serif" }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        </section>
      )}

      {/* ── ABOUT ── */}
      <section ref={aboutRef} className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-8 items-center">
          <motion.div initial="hidden" animate={aboutInView ? "visible" : "hidden"} variants={stagger} className="space-y-5">
            <motion.div variants={fadeUp}>
              <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>About The Academy</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline">
                Built by Bankers, for Bankers
              </h2>
            </motion.div>
            <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              The Bankers Academy LLP is a premier Institute of Private Banking Excellence dedicated to transforming aspiring professionals into confident, capable private banking and finance practitioners. Founded by senior private banking professionals with over 40 years of combined industry experience.
            </motion.p>
            <motion.p variants={fadeUp} className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Our training is built on one principle: teach students exactly what the industry needs — not just what helps them pass an interview, but what helps them survive and grow once they are in. Every module is designed with that in mind.
            </motion.p>
            <motion.div variants={stagger} className="space-y-3 pt-2">
              {[
                { title: "Our Mission", desc: "Bridge the gap between academic education and industry requirements through practical, industry-aligned private banking training." },
                { title: "Our Vision", desc: "To be India's most trusted institute for private banking and finance career development, measured by the long-term success of every student." }
              ].map(({ title, desc }) => (
                <motion.div key={title} variants={fadeUp} className="flex gap-3 border-l-4 border-[#C89B3C] pl-4 py-1">
                  <div>
                    <div className="font-semibold text-[#0B1F4D] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</div>
                    <div className="text-gray-600 text-sm mt-1" style={{ fontFamily: "'Open Sans', sans-serif" }}>{desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="pt-2">
              <Link href="/about">
                <button className="inline-flex items-center px-5 py-2.5 bg-[#0B1F4D] hover:bg-[#0d2455] text-white text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Read More About Us <ArrowRight className="ml-2" size={15} />
                </button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate={aboutInView ? "visible" : "hidden"} variants={fadeUp} className="grid grid-cols-2 gap-4">
            {[
              { number: "1000+", label: "Students Placed", sub: "Since inception" },
              { number: "20+", label: "Organizations", sub: "Private Banks, NBFCs" },
              { number: "100%", label: "Placement Rate", sub: "Consistent track record" },
              { number: "2 Months", label: "Program Duration", sub: "Full-time, intensive" }
            ].map(({ number, label, sub }) => (
              <div
                key={label}
                className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-[#C89B3C] transition-all duration-500"
              >
                <div className="text-2xl font-bold text-[#C89B3C]" style={{ fontFamily: "'Raleway', sans-serif" }}>{number}</div>
                <div className="font-semibold text-[#0B1F4D] text-sm mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{label}</div>
                <div className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section ref={whyRef} className="section-padding section-bg-alt">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" animate={whyInView ? "visible" : "hidden"} variants={fadeUp} className="mb-8">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Why The Bankers Academy</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline">Why Choose Us</h2>
            <p className="text-gray-600 mt-5 max-w-2xl" style={{ fontFamily: "'Open Sans', sans-serif" }}>Six pillars that set our program apart from any other private banking training in India.</p>
          </motion.div>

          <motion.div initial="hidden" animate={whyInView ? "visible" : "hidden"} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded bg-[#0B1F4D]/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="text-[#C89B3C]" size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1F4D] text-base mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED COURSE ── */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Our Flagship Program</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline">Private Banking & Finance Excellence Program</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-[#0B1F4D] p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-xl" style={{ fontFamily: "'Raleway', sans-serif" }}>Private Banking & Finance Excellence Program</h3>
                    <p className="text-blue-200 mt-1 text-sm italic">"Not Just a Job — A Career That Lasts"</p>
                  </div>
                  <span className="px-2.5 py-1 bg-[#C89B3C] text-white text-xs font-semibold rounded whitespace-nowrap ml-4">Flagship</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                  {[{ l: "Duration", v: "2 Months" }, { l: "Mode", v: "Full-Time" }, { l: "Eligibility", v: "Any Graduate" }, { l: "Placement", v: "Assisted" }].map(({ l, v }) => (
                    <div key={l} className="bg-white/10 rounded p-2.5 border border-white/10">
                      <div className="text-blue-200 text-xs">{l}</div>
                      <div className="text-white font-semibold text-sm mt-0.5">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-[#0B1F4D] text-sm mb-3 uppercase tracking-wide" style={{ fontFamily: "'Poppins', sans-serif" }}>Program Modules</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {["Banking Fundamentals & Products", "Banking Sales Process", "Banking Operations & Compliance", "Insurance & Wealth Management", "Insights of NBFC", "Digital Banking", "Basic Fraud Detection & Prevention", "Mock Interviews & Placement Prep"].map(m => (
                    <div key={m} className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                      <ChevronRight size={14} className="text-[#C89B3C] shrink-0" />
                      {m}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <Link href="/program">
                    <button className="px-5 py-2.5 bg-[#0B1F4D] hover:bg-[#0d2455] text-white text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      View Full Details
                    </button>
                  </Link>
                  <Link href="/admission">
                    <button className="px-5 py-2.5 border border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-white text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Apply Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#f5f7fb] border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-[#0B1F4D] text-sm mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>What Makes It Different</h4>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>While most programs teach you how to crack an interview, we teach you how to survive, thrive, and grow once you are in. Our faculty are active private banking professionals — not teachers.</p>
              </div>
              <div className="bg-[#0B1F4D] rounded-lg p-5 text-white">
                <h4 className="font-semibold text-sm mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>Next Batch</h4>

                <div className="text-[#C89B3C] font-bold text-lg">August 2026</div>
                <div className="text-blue-200 text-sm mt-1">Limited seats available</div>
                <Link href="/admission">
                  <button className="mt-4 w-full py-2.5 bg-[#C89B3C] hover:bg-[#b8892e] text-white text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Register Interest
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section ref={processRef} className="section-padding section-bg-alt">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" animate={processInView ? "visible" : "hidden"} variants={fadeUp} className="mb-8">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>How It Works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline">Our Training Process</h2>
          </motion.div>
          <motion.div initial="hidden" animate={processInView ? "visible" : "hidden"} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map(({ step, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="bg-white border border-gray-200 rounded-lg p-5 flex gap-4">
                <div className="w-10 h-10 rounded bg-[#0B1F4D] flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ fontFamily: "'Raleway', sans-serif" }}>{step}</div>
                <div>
                  <h3 className="font-bold text-[#0B1F4D] text-sm mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{title}</h3>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section ref={faqRef} className="section-padding section-bg-alt">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial="hidden" animate={faqInView ? "visible" : "hidden"} variants={fadeUp} className="mb-8">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Got Questions?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline">Frequently Asked Questions</h2>
          </motion.div>
          <motion.div initial="hidden" animate={faqInView ? "visible" : "hidden"} variants={stagger}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <AccordionItem value={`faq-${i}`} className="bg-white border border-gray-200 rounded-lg px-5">
                    <AccordionTrigger className="font-semibold text-[#0B1F4D] text-left py-4 hover:no-underline hover:text-[#C89B3C] transition-colors text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed pb-4 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section ref={ctaRef} className="section-padding bg-[#0B1F4D]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" animate={ctaInView ? "visible" : "hidden"} variants={stagger} className="grid md:grid-cols-2 gap-7 items-center">
            <motion.div variants={fadeUp} className="text-white">

              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>Ready to Start Your Private Banking Career?</h2>
              <p className="text-blue-200 leading-relaxed mb-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>Join 1000+ students who have built successful careers in private banking and finance through The Bankers Academy's flagship program. Our next batch starts in August 2026.</p>

              <div className="flex flex-wrap gap-3">
                <Link href="/admission">
                  <button className="inline-flex items-center px-6 py-3 bg-[#C89B3C] hover:bg-[#b8892e] text-white text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Apply for Admission <ArrowRight className="ml-2" size={16} />
                  </button>
                </Link>
                <Link href="/program">
                  <button className="inline-flex items-center px-6 py-3 border border-white/40 text-white hover:bg-white/10 text-sm font-semibold rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    View Program
                  </button>
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-4">
              {[
                { icon: Phone, label: "Call Us", value: "+91-6306286395", sub: "Mon–Sat, 9 AM – 6 PM" },
                { icon: Mail, label: "Email Us", value: "admissions@thebankersacademy.org", sub: "We respond within 24 hours" },
                { icon: MapPin, label: "Visit Us", value: "First Floor Dev Residency, Plot No.803, P Block", sub: "Kakadeo, Kanpur, 208025" }
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="text-[#C89B3C]" size={18} />
                  </div>
                  <div>
                    <div className="text-blue-200 text-xs" style={{ fontFamily: "'Open Sans', sans-serif" }}>{label}</div>
                    <div className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{value}</div>
                    <div className="text-blue-300 text-xs" style={{ fontFamily: "'Open Sans', sans-serif" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
