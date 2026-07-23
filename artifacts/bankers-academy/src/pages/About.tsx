import { useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Award, Users, Target, BookOpen, Lightbulb, Shield, Heart, TrendingUp, CheckCircle } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const leadership = [
  { name: "Mr. Rajeev Taneja", role: "Chief Patron", exp: "Decades of experience as a businessman", desc: "An Experienced businessman having a vast experience of running businesses with in-depth knowledge of finance.", initials: "RT" },
  { name: "Mr. Atin Khare", role: "Founder & Core Faculty Member", exp: "20+ Years in Private Banking", desc: "An ex-banker having more than two decades of experience in retail banking, trade finance, treasury and wealth management.", initials: "AK" },
  { name: "Mr. Sankalp Bhalla", role: "Core Faculty Member", exp: "20+ Years as a CA", desc: "A qualified Chartered Accountant with more than two decades of practice and having in-depth knowledge of accounts, Gov. regulations & compliances in the financial industry", initials: "SB" },
];

const coreValues = [
  { icon: Award, title: "Excellence", desc: "We hold ourselves to the highest standards in everything we deliver — from training quality to placement support." },
  { icon: Shield, title: "Integrity", desc: "Transparent, honest, and ethical in every interaction with students, partners, and institutions." },
  { icon: BookOpen, title: "Industry-Alignment", desc: "Our curriculum evolves with the industry. We don't teach theory — we teach what actually works in private banking today." },
  { icon: Heart, title: "Student-First", desc: "Every decision we make is anchored in what is best for our students' long-term career outcomes." },
  { icon: Lightbulb, title: "Innovation", desc: "Continuously updating our approach, methods, and technology to stay ahead of the rapidly changing financial landscape." },
  { icon: TrendingUp, title: "Growth Mindset", desc: "We believe every student has the potential to rise to leadership in private banking. Our job is to help them get there." }
];

const achievements = [
  { number: "40+", label: "Years Combined Faculty Experience" },
  { number: "20+", label: "Organizations across Private Banks & NBFCs" },
  { number: "100%", label: "Placement Assistance Rate" },
  { number: "8", label: "Program Modules" },
];

const whyWeStarted = [
  "Fresh graduates were entering the private banking sector with academic degrees but no practical knowledge of how private banking actually works on the ground.",
  "Existing training institutes focused on exam prep — not on building professionals who could contribute from Day 1.",
  "Private Banks and NBFCs were spending enormous resources re-training new hires because the foundational skills weren't there.",
  "No institution was teaching the soft skills, compliance mindset, and customer-handling ability that private banks actually look for.",
];

const facultyCredentials = [
  { stat: "40+", desc: "Years of combined industry experience across our core faculty team" },
  { stat: "5", desc: "Former senior private banking executives from India's top private sector private banks" },
  { stat: "20+", desc: "Organization relationships built through decades of industry networks" },
  { stat: "4", desc: "Sectors covered — Private Banking, NBFCs, Insurance, and Digital Finance" },
];

export default function About() {
  useEffect(() => {
    document.title = "About Us — The Bankers Academy LLP";
  }, []);

  const storyRef = useRef(null);
  const leadershipRef = useRef(null);
  const whyRef = useRef(null);
  const valuesRef = useRef(null);
  const credRef = useRef(null);

  const storyInView = useInView(storyRef, { once: true, margin: "-60px" });
  const leadershipInView = useInView(leadershipRef, { once: true, margin: "-60px" });
  const whyInView = useInView(whyRef, { once: true, margin: "-60px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-60px" });
  const credInView = useInView(credRef, { once: true, margin: "-60px" });

  return (
    <div className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="hero-gradient py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.span variants={fadeUp} className="inline-block px-3 py-1 rounded bg-[#C89B3C]/20 border border-[#C89B3C]/40 text-[#C89B3C] text-xs font-semibold tracking-widest uppercase">
              Our Story
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
              About The Bankers Academy
            </motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Founded in 2026 by senior private banking professionals with 40+ years of combined industry experience — built to train the next generation of Indian private banking talent.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section ref={storyRef} className="section-padding bg-[#f8fafc]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={storyInView ? "visible" : "hidden"} variants={stagger} className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div variants={fadeUp} className="space-y-5">
              <div>
                <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Our Story</span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  Built by Bankers, for Bankers
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                The Bankers Academy LLP was founded in 2026 — not as another coaching centre, but as an institution purpose-built to solve a real problem in the Indian private banking industry.
              </p>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Our founders are senior private banking professionals with a collective 40+ years of hands-on experience across India's leading private sector private banks, NBFCs, and insurance companies. They have personally hired, trained, managed, and mentored hundreds of private banking professionals across their careers.
              </p>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                When they came together to build The Bankers Academy, the goal was clear: bring everything they had learned — every shortcut, every mistake, every best practice — directly into the classroom so that our students enter the industry as prepared as possible.
              </p>
              <div className="flex items-center gap-3 pt-2 bg-[#0B1F4D]/5 border border-[#0B1F4D]/10 rounded-lg px-4 py-3">
                <div className="w-10 h-10 rounded bg-[#0B1F4D] flex items-center justify-center shrink-0">
                  <Award className="text-[#C89B3C]" size={18} />
                </div>
                <div>
                  <div className="font-bold text-[#0B1F4D] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Founded 2026 · Established by Industry Veterans</div>
                  <div className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "'Open Sans', sans-serif" }}>New institution, decades of expertise behind it</div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {achievements.map(({ number, label }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-lg p-5 text-center hover-lift shadow-sm">
                  <div className="font-bold text-3xl text-[#C89B3C]" style={{ fontFamily: "'Raleway', sans-serif" }}>{number}</div>
                  <div className="text-gray-500 text-sm mt-2" style={{ fontFamily: "'Open Sans', sans-serif" }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY WE STARTED ── */}
      <section ref={whyRef} className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={whyInView ? "visible" : "hidden"} variants={stagger} className="grid lg:grid-cols-2 gap-8 items-start">
            <motion.div variants={fadeUp}>
              <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Why We Exist</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 mb-5 section-title-underline" style={{ fontFamily: "'Raleway', sans-serif" }}>
                The Problem We Set Out to Solve
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                Our founders spent decades inside India's private banking system. What they consistently saw — across hiring, training, and managing teams — was the same recurring gap:
              </p>
              <div className="space-y-4">
                {whyWeStarted.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-[#C89B3C] shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>{point}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mt-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                The Bankers Academy was built to close that gap — permanently, for every student who joins us.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <div className="bg-[#0B1F4D] rounded-lg p-6 text-white">
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Raleway', sans-serif" }}>Our Approach</h3>
                <p className="text-blue-200 text-sm leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                  We don't train students to pass interviews. We train them to excel at the job. Every session is built around what a private banking professional actually needs on Day 1 and beyond — not what's on a syllabus.
                </p>
              </div>
              <div className="bg-[#f5f7fb] border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#0B1F4D] text-base mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>The Faculty Difference</h3>
                <div className="space-y-4">
                  {facultyCredentials.map(({ stat, desc }) => (
                    <div key={stat} className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-[#C89B3C] w-14 shrink-0 text-center" style={{ fontFamily: "'Raleway', sans-serif" }}>{stat}</div>
                      <div className="text-gray-600 text-sm" style={{ fontFamily: "'Open Sans', sans-serif" }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="section-padding bg-[#f5f7fb]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-8">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>Our Purpose</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2" style={{ fontFamily: "'Raleway', sans-serif" }}>Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded bg-[#0B1F4D]/5 flex items-center justify-center mb-5">
                <Target className="text-[#0B1F4D]" size={24} />
              </div>
              <h3 className="font-bold text-[#0B1F4D] text-xl mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>Our Mission</h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                To bridge the gap between academic education and real industry requirements by delivering practical, industry-aligned private banking training that prepares every student not just to get a job — but to build a lasting, growing career in the private banking and finance sector.
              </p>
            </div>
            <div className="hero-gradient rounded-lg p-8 text-white">
              <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center mb-5">
                <Award className="text-[#C89B3C]" size={24} />
              </div>
              <h3 className="font-bold text-white text-xl mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>Our Vision</h3>
              <p className="text-blue-100 leading-relaxed" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                To be India's most trusted Institute of Private Banking Excellence — known not for the number of students we train, but for the long-term success, leadership, and career transformation of every student who walks through our doors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section ref={leadershipRef} className="section-padding bg-white">
  <div className="container mx-auto px-4 md:px-6">
    <div className="text-center mb-8">
      <motion.div
        initial="hidden"
        animate={leadershipInView ? "visible" : "hidden"}
        variants={fadeUp}
        className="mb-8"
      >
        <span
          className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          Our People
        </span>

        <h2
          className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          Leadership & Expert Faculty
        </h2>

        <p
          className="text-gray-600 mt-4 max-w-xl mx-auto"
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          Industry veterans who left the boardrooms of India's top private
          banks to build the next generation of private banking professionals.
        </p>
      </motion.div>
    </div>

    <motion.div
      initial="hidden"
      animate={leadershipInView ? "visible" : "hidden"}
      variants={stagger}
      className="flex flex-wrap justify-center gap-5"
    >
      {leadership.map(({ name, role, exp, desc, initials }) => (
        <motion.div
          key={name}
          variants={fadeUp}
          className="w-full max-w-[390px] bg-[#f5f7fb] border border-gray-200 rounded-lg p-6 hover-lift"
        >
          <div className="w-14 h-14 rounded-full bg-[#0B1F4D] flex items-center justify-center mb-4">
            <span
              className="font-bold text-white text-lg"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {initials}
            </span>
          </div>

          <h3
            className="font-bold text-[#0B1F4D] text-base"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {name}
          </h3>

          <div
            className="text-[#C89B3C] text-sm font-semibold mt-1"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {role}
          </div>

          <div
            className="text-gray-500 text-xs mt-1 mb-3"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {exp}
          </div>

          <p
            className="text-gray-600 text-sm leading-relaxed"
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            {desc}
          </p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

      {/* ── CORE VALUES ── */}
      <section ref={valuesRef} className="section-padding bg-[#f5f7fb]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
          <motion.div initial="hidden" animate={valuesInView ? "visible" : "hidden"} variants={fadeUp} className="mb-8">
            <span className="block text-[#C89B3C] text-xs font-semibold tracking-widest uppercase" style={{ fontFamily: "'Open Sans', sans-serif" }}>What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F4D] mt-2 section-title-underline" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Our Core Values
            </h2>
          </motion.div>
          </div>
          <motion.div initial="hidden" animate={valuesInView ? "visible" : "hidden"} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreValues.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="bg-white border border-gray-200 rounded-lg p-6 hover-lift">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded bg-[#C89B3C]/10 flex items-center justify-center shrink-0">
                    <Icon className="text-[#C89B3C]" size={20} />
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

      {/* ── CTA STRIP ── */}
      <section className="bg-[#0B1F4D] py-8">
        <div className="container mx-auto px-4 md:px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Raleway', sans-serif" }}>Ready to Build Your Private Banking Career?</h2>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            Train under professionals who have lived the private banking career you want to build.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/program">
              <button className="px-6 py-3 bg-[#C89B3C] hover:bg-[#b8892e] text-white font-semibold text-sm rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                View Our Program
              </button>
            </a>
            <a href="/contact">
              <button className="px-6 py-3 border border-white/40 text-white hover:bg-white/10 font-semibold text-sm rounded transition-colors cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Contact Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
