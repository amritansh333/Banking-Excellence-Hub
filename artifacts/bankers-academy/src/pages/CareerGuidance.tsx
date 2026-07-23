import { useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { FileText, Mic2, TrendingUp, Download, CheckCircle, ArrowRight } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const resumeTips = [
  "Lead with a strong professional summary tailored to the private banking/finance role",
  "Quantify achievements — 'managed portfolio of 150+ clients' beats 'managed clients'",
  "Include relevant certifications: JAIIB, CAIIB, NISM, AMFI, IRDAI Exam",
  "Highlight internships, projects, and relevant coursework",
  "Use action verbs: managed, analysed, resolved, achieved, grew, initiated",
  "Keep formatting clean and ATS-friendly — avoid tables and graphics in resume body",
  "Tailor your resume for each role — a sales RM role needs different emphasis than operations",
  "Include a LinkedIn URL — 70% of private banking recruiters check LinkedIn before calling"
];

const interviewTips = [
  { q: "Tell me about yourself", tip: "Craft a 90-second pitch covering education, skills, what drives you, and why private banking. Practice until it flows naturally." },
  { q: "Why do you want to join private banking?", tip: "Show genuine interest. Mention the sector's role in the economy, your aptitude for finance, and specific aspects like client management or credit." },
  { q: "What do you know about our bank?", tip: "Research the bank's latest annual report, recent news, product offerings, and network size. One specific data point impresses far more than generic answers." },
  { q: "How do you handle a difficult customer?", tip: "Use the STAR method (Situation, Task, Action, Result). Show empathy, active listening, and a solution-oriented mindset." },
  { q: "Where do you see yourself in 5 years?", tip: "Show ambition with realism. 'I see myself in a branch management or credit leadership role, having built deep expertise in retail private banking.'" }
];

const roadmapSteps = [
  { level: "Entry Level (0–2 Years)", roles: ["Sales Officer", "Relationship Officer", "Private Banking Associate", "Insurance Advisor", "Operations Executive"], desc: "Build product knowledge, customer handling, and process discipline." },
  { level: "Mid Level (2–5 Years)", roles: ["Relationship Manager", "Branch Credit Officer", "Operations Supervisor", "Sales Manager", "Insurance Manager"], desc: "Deepen expertise in a specialisation, lead small teams, manage portfolios." },
  { level: "Senior Level (5–10 Years)", roles: ["Senior RM", "Branch Manager", "Credit Manager", "Area Sales Manager", "Cluster Head"], desc: "Own P&L responsibilities, lead large teams, drive business outcomes." },
  { level: "Leadership (10+ Years)", roles: ["Regional Head", "VP / Senior VP", "Chief Manager", "Deputy GM", "GM / President"], desc: "Strategic decision-making, board-level reporting, industry influence." }
];

const resources = [
  { title: "Private Banking Interview Preparation Guide", desc: "200+ commonly asked private banking interview questions with ideal answers", pages: "48 pages", type: "PDF Guide" },
  { title: "Resume Template for Private Banking & Finance", desc: "ATS-optimised resume template used by our successful alumni", pages: "3 formats", type: "Word Template" },
  { title: "Career Roadmap: Private Banking & Finance", desc: "Visual career path for all major private banking roles and progression timelines", pages: "12 pages", type: "PDF Guide" },
  { title: "KYC/AML Compliance Quick Reference", desc: "Essential regulatory compliance cheat sheet for private banking professionals", pages: "8 pages", type: "Quick Reference" }
];

export default function CareerGuidance() {
  useEffect(() => { document.title = "Career Guidance — The Bankers Academy LLP"; }, []);
  const resumeRef = useRef(null);
  const interviewRef = useRef(null);
  const roadmapRef = useRef(null);
  const resourcesRef = useRef(null);
  const resumeInView = useInView(resumeRef, { once: true, margin: "-80px" });
  const interviewInView = useInView(interviewRef, { once: true, margin: "-80px" });
  const roadmapInView = useInView(roadmapRef, { once: true, margin: "-80px" });
  const resourcesInView = useInView(resourcesRef, { once: true, margin: "-80px" });

  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.span variants={fadeUp} className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">Your Career Partner</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-bold">Career Guidance</motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg max-w-2xl mx-auto">From crafting your resume to cracking your interview — practical guidance from people who have been on both sides of the table.</motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/></svg></div>
      </section>

      {/* Resume Tips */}
      <section ref={resumeRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={resumeInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <FileText className="text-secondary" size={26} />
              </div>
              <div>
                <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Build Your Brand</span>
                <h2 className="font-serif text-3xl font-bold text-primary">Resume Tips for Private Banking Professionals</h2>
              </div>
            </motion.div>
            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-4">
              {resumeTips.map((tip, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-border shadow-sm hover:border-secondary/30 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-secondary font-bold text-xs">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interview Tips */}
      <section ref={interviewRef} className="section-padding bg-primary/[0.03]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={interviewInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Mic2 className="text-secondary" size={26} />
              </div>
              <div>
                <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Ace the Interview</span>
                <h2 className="font-serif text-3xl font-bold text-primary">Private Banking Interview Tips</h2>
              </div>
            </motion.div>
            <motion.div variants={stagger} className="space-y-4">
              {interviewTips.map(({ q, tip }, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                  <div className="bg-primary/5 px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-xs font-bold">Q{i + 1}</div>
                      <h3 className="font-semibold text-primary">{q}</h3>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-secondary shrink-0 mt-0.5" size={16} />
                      <p className="text-muted-foreground text-sm leading-relaxed">{tip}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Career Roadmap */}
      <section ref={roadmapRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={roadmapInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="text-secondary" size={26} />
              </div>
              <div>
                <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Your Path Forward</span>
                <h2 className="font-serif text-3xl font-bold text-primary">Private Banking Career Roadmap</h2>
              </div>
            </motion.div>
            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roadmapSteps.map(({ level, roles, desc }, i) => (
                <motion.div key={i} variants={fadeUp} className="relative">
                  <div className={`rounded-3xl p-6 border shadow-sm h-full ${i === 0 ? "bg-white border-secondary/30" : i === 3 ? "hero-gradient text-white" : "bg-white border-border"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-4 font-bold text-sm ${i === 3 ? "bg-white/20 text-white" : "bg-secondary/10 text-secondary"}`}>{i + 1}</div>
                    <h3 className={`font-serif font-bold text-sm mb-3 ${i === 3 ? "text-white" : "text-primary"}`}>{level}</h3>
                    <p className={`text-xs mb-3 leading-relaxed ${i === 3 ? "text-blue-100" : "text-muted-foreground"}`}>{desc}</p>
                    <ul className="space-y-1">
                      {roles.map(r => (
                        <li key={r} className={`text-xs flex items-center gap-1.5 ${i === 3 ? "text-blue-100" : "text-muted-foreground"}`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 3 ? "bg-secondary" : "bg-secondary/50"}`} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                      <ArrowRight className="text-secondary" size={20} />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Resources */}
      <section ref={resourcesRef} className="section-padding bg-primary/[0.03]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial="hidden" animate={resourcesInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-8">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Free Resources</span>
              <h2 className="font-serif text-4xl font-bold text-primary mt-3">Downloadable Career Resources</h2>
              <p className="text-muted-foreground mt-3">Curated by our expert faculty. Free for all students and alumni of The Bankers Academy.</p>
            </motion.div>
            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6">
              {resources.map(({ title, desc, pages, type }) => (
                <motion.div key={title} variants={fadeUp} className="bg-white rounded-3xl p-6 border border-border shadow-sm hover-lift flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex flex-col items-center justify-center shrink-0 text-center">
                    <Download className="text-primary" size={20} />
                    <span className="text-primary text-xs font-bold mt-0.5">{type.split(" ")[0]}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-primary text-base">{title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{pages} · {type}</span>
                      <button className="flex items-center gap-1 text-secondary text-sm font-semibold hover:underline cursor-pointer" data-testid={`button-download-${title.toLowerCase().replace(/\s+/g, "-").slice(0, 20)}`}>
                        Download <Download size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
