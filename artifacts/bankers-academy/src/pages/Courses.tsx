import { useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  ChevronRight,
  Target,
  TrendingUp,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const modules = [
  {
    no: "01",
    title: "Banking Fundamentals & Products",
    points: [
      "How Indian private banking works — from RBI guidelines to branch operations",
      "Overview of Regulatory Authorities",
      "All private banking products: loans, deposits, insurance, investments",
      "Understanding the private banking ecosystem — Private, PSU, NBFC, Co-operative",
    ],
  },
  {
    no: "02",
    title: "Banking Sales Process",
    points: [
      "How to find, approach, and convert potential private banking customers",
      "Basics of Retail Credit & SME Lending",
      "Cross-selling and up-selling in private banking",
      "Real scripts, objection handling, and closing techniques that work",
    ],
  },
  {
    no: "03",
    title: "Banking Operations & Compliance",
    points: [
      "Complete branch operations — day-to-day procedures inside a bank",
      "KYC, AML, RBI compliance frameworks every banker must know",
      "Understanding of Basic Private Banking MIS",
      "Account management, transactions, and error resolution",
    ],
  },
  {
    no: "04",
    title: "Insurance & Wealth Management",
    points: [
      "Life insurance, general insurance, and health insurance products",
      "How to sell insurance as a banker — IRDAI guidelines",
      "Understanding credit risk, market risk, and operational risk",
    ],
  },
  {
    no: "05",
    title: "Insights of NBFC",
    points: [
      "What makes NBFCs different from private banks — and why they are growing fast",
      "Loan products in the NBFC space — personal loans, business loans, gold loans",
      "Wealth Management & Investment Advisory basics",
      "Career opportunities in the NBFC sector",
    ],
  },
  {
    no: "06",
    title: "Digital Banking",
    points: [
      "Internet private banking, mobile private banking, UPI, and payment systems",
      "Digital payment ecosystems",
      "Basics of MS-Excel",
    ],
  },
  {
    no: "07",
    title: "Basic Fraud Detection & Prevention Techniques",
    points: [
      "Common types of private banking fraud",
      "Red flags & early detection techniques",
      "Preventive controls, best practices, and escalation procedures",
    ],
  },
  {
    no: "08",
    title: "Interview Preparation & Placement",
    points: [
      "Resume building for private banking jobs",
      "Multiple mock interview rounds with real private banking questions",
      "Group discussion practice, communication skills, and professional grooming",
    ],
  },
];

const outcomes = [
  "Walk into your first private banking job already knowing how things work — not learning from scratch",
  "Speak, present, and carry yourself like a private banking professional",
  "Pass any bank interview — government or private — with confidence",
  "Understand the full spectrum of private banking and finance — not just one area",
  "Build connections with professionals in the private banking sector before you even start working",
  "Have a resume and interview style that stands out in a crowd of applicants",
];

const whoIsItFor = [
  {
    title: "Fresh Graduates",
    desc: "Any graduate who wants to start a career in private banking, finance, or insurance — B.Com, BA, BBA, BSc, or any other stream.",
  },
  {
    title: "Final Year Students",
    desc: "Get trained during your last year so you are placement-ready the moment your exam results come out.",
  },
  {
    title: "Working Professionals",
    desc: "Already working in some other field but want to switch to private banking? This program will build your foundation fast.",
  },
  {
    title: "Private Banking Aspirants",
    desc: "Preparing for IBPS, SBI PO, or other private banking exams? Our practical training complements your exam preparation.",
  },
];

export default function Courses() {
  useEffect(() => {
    document.title = "Courses — The Bankers Academy LLP";
  }, []);

  const modulesRef = useRef(null);
  const outcomesRef = useRef(null);
  const whoRef = useRef(null);

  const modulesInView = useInView(modulesRef, { once: true, margin: "-60px" });
  const outcomesInView = useInView(outcomesRef, {
    once: true,
    margin: "-60px",
  });
  const whoInView = useInView(whoRef, { once: true, margin: "-60px" });

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="hero-gradient py-9 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center text-white space-y-5 max-w-3xl mx-auto"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-3 py-1 rounded bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-semibold tracking-widest uppercase"
            >
              Our Course
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              One Course. One Mission.
              <br />
              <span className="text-[#C89B3C]">
                Your Private Banking Career.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-blue-100 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              We do not offer 10 courses and confuse you. We offer one focused,
              industry-designed program that takes you from where you are today
              to where you want to be — in 2 months.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 50L1440 50L1440 0C1200 33 960 50 720 50C480 50 240 33 0 0L0 50Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* ── COURSE CARD ── */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-[#0B1F4D] p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded bg-[#C89B3C]/20 flex items-center justify-center">
                      <BookOpen className="text-[#C89B3C]" size={24} />
                    </div>
                    <div>
                      <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase">
                        Flagship Program
                      </span>
                      <h2
                        className="text-white font-bold text-xl leading-snug"
                        style={{ fontFamily: "'Raleway', sans-serif" }}
                      >
                        Private Banking & Finance Excellence Program
                      </h2>
                    </div>
                  </div>
                  <p
                    className="text-blue-200 italic text-base"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    "Not Just a Job — A Career That Grows With You"
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="px-4 py-2 bg-[#C89B3C] text-white text-sm font-bold rounded">
                    Admissions Open
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { icon: Clock, label: "Duration", value: "2 Months" },
                  { icon: Users, label: "Mode", value: "Full-Time" },
                  { icon: Award, label: "Eligibility", value: "Any Graduate" },
                  { icon: Target, label: "Placement", value: "Assisted" },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-white/10 border border-white/10 rounded p-3"
                  >
                    <div className="flex items-center gap-1.5 text-blue-200 text-xs mb-1">
                      <Icon size={12} />
                      {label}
                    </div>
                    <div className="text-white font-bold text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3
                  className="font-bold text-[#0B1F4D] text-base mb-4 uppercase tracking-wide text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  What Makes This Program Different
                </h3>
                <p
                  className="text-gray-600 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  Most private banking courses teach you enough to pass an
                  interview. We teach you enough to build a career. Our faculty
                  are not just teachers — they are people who have spent 15 to
                  25 years working inside Indian private banks, hiring teams,
                  managing operations, and building private banking portfolios.
                </p>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  When they teach you how to handle a customer objection, they
                  are teaching you from their own experience — not from a
                  textbook. That is the difference you will feel from Day 1.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { stat: "1000+", label: "Students Placed" },
                  { stat: "20+", label: "Organizations" },
                  { stat: "100%", label: "Placement Rate" },
                  { stat: "40+", label: "Years Faculty Exp." },
                ].map(({ stat, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 bg-[#f5f7fb] border border-gray-100 rounded p-3"
                  >
                    <div
                      className="text-xl font-bold text-[#C89B3C]"
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                    >
                      {stat}
                    </div>
                    <div
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 md:px-8 py-5 flex flex-wrap gap-3">
              <Link href="/enquiry">
                <button
                  className="px-6 py-3 bg-[#0B1F4D] hover:bg-[#0d2455] text-white text-sm font-bold rounded transition-colors cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Enquire Now — It's Free
                </button>
              </Link>
              <Link href="/admission">
                <button
                  className="px-6 py-3 border border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-white text-sm font-bold rounded transition-colors cursor-pointer"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Apply for Admission
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES ── */}
      <section ref={modulesRef} className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            animate={modulesInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="mb-7"
          >
            <span
              className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              What You Will Learn
            </span>
            <h2
              className="text-3xl font-bold text-[#0B1F4D] mt-2 section-title-underline"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              8 Modules. Everything You Need.
            </h2>
            <p
              className="text-gray-600 mt-4 max-w-2xl"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Each module is designed and delivered by a professional who has
              worked in that area of private banking. Not theory — real
              experience.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={modulesInView ? "visible" : "hidden"}
            variants={stagger}
            className="space-y-4"
          >
            {modules.map(({ no, title, points }) => (
              <motion.div
                key={no}
                variants={fadeUp}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="flex items-center gap-4 px-5 py-4 bg-[#f5f7fb] border-b border-gray-100">
                  <div
                    className="w-9 h-9 rounded bg-[#0B1F4D] flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {no}
                  </div>
                  <h3
                    className="font-bold text-[#0B1F4D] text-base"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {title}
                  </h3>
                </div>
                <div className="px-5 py-4 grid sm:grid-cols-3 gap-2">
                  {points.map((point) => (
                    <div key={point} className="flex items-start gap-2">
                      <ChevronRight
                        size={13}
                        className="text-[#C89B3C] shrink-0 mt-0.5"
                      />
                      <p
                        className="text-gray-600 text-sm"
                        style={{ fontFamily: "'Open Sans', sans-serif" }}
                      >
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── OUTCOMES ── */}
      <section ref={outcomesRef} className="section-padding bg-[#0B1F4D]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            animate={outcomesInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-7"
          >
            <span
              className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              After This Program
            </span>
            <h2
              className="text-3xl font-bold text-white mt-2"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              You Will Be a Different Person
            </h2>
            <p
              className="text-blue-200 mt-3"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Not just job-ready — career-ready. Here is what changes after 2
              months with us:
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate={outcomesInView ? "visible" : "hidden"}
            variants={stagger}
            className="grid sm:grid-cols-2 gap-4"
          >
            {outcomes.map((outcome) => (
              <motion.div
                key={outcome}
                variants={fadeUp}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <Star size={15} className="text-[#C89B3C] shrink-0 mt-0.5" />
                <p
                  className="text-blue-100 text-sm leading-relaxed"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {outcome}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section ref={whoRef} className="section-padding bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            animate={whoInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="mb-7"
          >
            <span
              className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Is This For Me?
            </span>
            <h2
              className="text-3xl font-bold text-[#0B1F4D] mt-2 section-title-underline"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Who Should Join This Program?
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            animate={whoInView ? "visible" : "hidden"}
            variants={stagger}
            className="grid sm:grid-cols-2 gap-5"
          >
            {whoIsItFor.map(({ title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="bg-white border border-gray-200 rounded-lg p-5 hover-lift"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp
                    size={18}
                    className="text-[#C89B3C] shrink-0 mt-0.5"
                  />
                  <div>
                    <h3
                      className="font-bold text-[#0B1F4D] text-base mb-1"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-gray-600 text-sm leading-relaxed"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2
            className="text-3xl font-bold text-[#0B1F4D] mb-4"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Still Have Questions? Let's Talk.
          </h2>
          <p
            className="text-gray-600 mb-8 leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            We know choosing a training program is a big decision. Our
            counsellors are here to help you make the right one — even if that
            means telling you this program is not the right fit for you. Call
            us, and let's talk.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/enquiry">
              <button
                className="inline-flex items-center px-6 py-3 bg-[#0B1F4D] hover:bg-[#0d2455] text-white font-bold text-sm rounded transition-colors cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Send an Enquiry <ArrowRight className="ml-2" size={15} />
              </button>
            </Link>
            <Link href="/admission">
              <button
                className="inline-flex items-center px-6 py-3 bg-[#C89B3C] hover:bg-[#b8892e] text-white font-bold text-sm rounded transition-colors cursor-pointer"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Apply for Admission
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
