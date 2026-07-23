import { useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { CheckCircle, ArrowRight, TrendingUp, Users, Building2, Award } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const placementProcess = [
  { step: "01", title: "Resume Building", desc: "Expert review and professional polish of your resume and LinkedIn profile by our placement team." },
  { step: "02", title: "Mock Interviews", desc: "3+ rounds of mock interviews with industry panellists covering HR, technical, and aptitude rounds." },
  { step: "03", title: "GD Sessions", desc: "Group Discussion rounds on current private banking topics to sharpen communication and analytical skills." },
  { step: "04", title: "Placement Drives", desc: "Regular drives with our 20+ partner organisations across private banking, NBFC, and insurance sectors." },
  { step: "05", title: "Offer & Joining", desc: "Support through offer negotiation, background verification, and joining formalities." },
  { step: "06", title: "Post-Placement Support", desc: "Ongoing career guidance and mentorship even after placement to ensure long-term growth." }
];

const hiringPartners = [
  "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "SBI",
  "Yes Bank", "IndusInd Bank", "IDFC First Bank", "Federal Bank", "RBL Bank",
  "Bajaj Finance", "Muthoot Finance", "Shriram Finance", "Mahindra Finance",
  "LIC", "HDFC Life", "ICICI Prudential", "SBI Life", "Max Life Insurance",
  "Aditya Birla Capital", "PNB Housing Finance", "IIFL Finance", "Home First Finance",
  "Tata Capital", "HDB Financial Services", "AU Small Finance Bank", "Bandhan Bank",
  "Ujjivan Bank", "Equitas Bank", "Unity Small Finance Bank"
];

const stats = [
  { icon: TrendingUp, value: "100%", label: "Placement Assistance Rate" },
  { icon: Users, value: "1000+", label: "Students Successfully Placed" },
  { icon: Building2, value: "20+", label: "Organizations across Private Banks & NBFCs" },
  { icon: Award, value: "3 Months", label: "Average Time to Placement" }
];

const SHOW_HIRING_PARTNERS_SECTION = false;

export default function Placements() {
  useEffect(() => { document.title = "Placements — The Bankers Academy LLP"; }, []);
  const processRef = useRef(null);
  const partnersRef = useRef(null);
  const processInView = useInView(processRef, { once: true, margin: "-80px" });
  const partnersInView = useInView(partnersRef, { once: true, margin: "-80px" });

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.span variants={fadeUp} className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">100% Placement Rate</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-bold">Placements</motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg max-w-2xl mx-auto">20+ hiring organizations. 1000+ students placed. Careers that last a lifetime.</motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/></svg></div>
      </section>

      {/* Stats Bar */}
      <section className="py-9 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-secondary" size={22} />
                </div>
                <div className="font-serif text-3xl font-bold text-primary">{value}</div>
                <div className="text-muted-foreground text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Process */}
      <section ref={processRef} className="section-padding bg-primary/[0.03]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial="hidden" animate={processInView ? "visible" : "hidden"} variants={fadeUp} className="text-center mb-7">
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">How We Place You</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-3">Our Placement Process</h2>
          </motion.div>
          <motion.div initial="hidden" animate={processInView ? "visible" : "hidden"} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placementProcess.map(({ step, title, desc }) => (
              <motion.div key={step} variants={fadeUp} className="bg-white rounded-3xl p-6 border border-border shadow-sm hover-lift">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <span className="font-bold text-primary font-serif">{step}</span>
                </div>
                <h3 className="font-serif font-bold text-primary text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Hiring Partners — currently hidden. Flip SHOW_HIRING_PARTNERS_SECTION above to true to bring it back. */}
      {SHOW_HIRING_PARTNERS_SECTION && (
        <section ref={partnersRef} className="section-padding bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial="hidden" animate={partnersInView ? "visible" : "hidden"} variants={fadeUp} className="text-center mb-7">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Our Network</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-3">20+ Organizations</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">We have built deep, trusted relationships with leading private banks, NBFCs, and insurance companies across India.</p>
            </motion.div>
            <motion.div initial="hidden" animate={partnersInView ? "visible" : "hidden"} variants={stagger} className="flex flex-wrap gap-3 justify-center">
              {hiringPartners.map((partner) => (
                <motion.div key={partner} variants={fadeUp} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-full shadow-sm hover:border-secondary/40 hover:shadow-md transition-all">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{partner[0]}</div>
                  <span className="text-sm font-medium text-foreground">{partner}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
          <div className="hero-gradient rounded-3xl p-12 text-white">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Your Story Starts Here</h2>
            <p className="text-blue-100 mb-8">Join 1000+ alumni building successful careers in private banking and finance across India.</p>
            <Link href="/admission">
              <Button size="lg" className="gold-gradient text-white rounded-full px-10 py-5 font-semibold hover:scale-105 transition-transform cursor-pointer">
                Apply Now <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
