import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, Clock, Users, Award, BookOpen, ArrowRight, ChevronDown, Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const modules = [
  { num: "01", title: "Banking Fundamentals & Products", topics: ["Structure of Indian Private Banking System", "Overview of Regulatory Authorities", "Types of Bank Accounts & Deposits", "Loans, Credit Products & NPA Management", "RBI Guidelines & Private Banking Regulations", "Financial Statements & Analysis"] },
  { num: "02", title: "Banking Sales Process", topics: ["Retail Private Banking Sales Process", "Basics of Retail Credit & SME Lending", "Lead Generation & Prospecting", "Customer Need Analysis", "Cross-selling & Up-selling", "Objection Handling & Negotiation"] },
  { num: "03", title: "Banking Operations & Regulatory Compliance", topics: ["Complete Branch Operations", "KYC/AML Compliance", "Core Private Banking Systems Overview", "Fraud Detection & Risk Mitigation", "Understanding of Basic Private Banking MIS"] },
  { num: "04", title: "Insurance & Wealth Management", topics: ["Life Insurance Products & Planning", "General & Health Insurance", "IRDAI Regulations & Compliance", "Risk Assessment Techniques", "Insurance Sales & Advisory"] },
  { num: "05", title: "Insights of NBFC", topics: ["NBFC Structure & RBI Regulations", "Microfinance & Priority Sector Lending", "Vehicle & Gold Loans", "MSME Financing", "Wealth Management & Investment Advisory"] },
  { num: "06", title: "Digital Banking", topics: ["UPI, Mobile Private Banking & Internet Private Banking", "Digital Payment Ecosystems", "Basics of MS-Excel"] },
  { num: "07", title: "Basic Fraud Detection & Prevention Techniques", topics: ["Common Types of Private Banking Fraud", "Red Flags & Early Detection Techniques", "Preventive Controls & Best Practices", "Reporting & Escalation Procedures"] },
  { num: "08", title: "Mock Interviews & Placement Preparation", topics: ["Resume Writing & LinkedIn Optimisation", "Group Discussion Techniques", "Panel Interview Simulations", "HR & Aptitude Test Preparation", "Professional Communication & Grooming"] }
];

const outcomes = [
  "Understand the complete structure and operations of India's private banking system",
  "Confidently sell, cross-sell, and upsell private banking and financial products",
  "Navigate regulatory compliance frameworks including KYC, AML, and FEMA",
  "Handle customer relationships with professionalism and empathy",
  "Analyse credit, assess risk, and understand NPA management",
  "Operate confidently with digital private banking tools and FinTech platforms",
  "Crack private banking and finance sector interviews with confidence",
  "Build a long-term career roadmap in your chosen financial domain"
];

{/*
const faqs = [
  { q: "Is any prior private banking experience required?", a: "No prior private banking experience is required. The program is designed for fresh graduates and career changers. We start from fundamentals and build up to advanced industry practices." },
  { q: "What are the class timings?", a: "Classes are held Monday to Friday, typically from 9:30 AM to 4:30 PM. The schedule includes classroom sessions, practical workshops, and guest lectures from industry professionals." },
  { q: "Will there be a guarantee of placement?", a: "We offer placement assistance, not a guarantee. However, our 100% placement rate reflects the quality of our training and the depth of our hiring partner network. We conduct multiple placement drives throughout and after the program." },
  { q: "Is the certificate recognised by private banks?", a: "Our certificate is recognised by our 20+ hiring partner organisations. Many students mention that the Bankers Academy certification was a key factor in their selection during HR interviews." },
  { q: "What is the fee structure?", a: "Please contact our admissions team for current fee details. We also assist eligible students with education loan guidance and flexible payment plans." }
];
*/}

const applySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address"),
  education: z.string().min(2, "Please enter your educational qualification"),
  message: z.string().optional()
});

export default function Program() {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<number | null>(null);

type Faq = {
  id: number;
  question: string;
  answer: string;
};

const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
  document.title =
    "Private Banking & Finance Excellence Program — The Bankers Academy LLP";

  const loadFaqs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/faqs");
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      console.error(err);
    }
  };

  loadFaqs();
}, []);

  const heroRef = useRef(null);
  const overviewRef = useRef(null);
  const modulesRef = useRef(null);
  const outcomesRef = useRef(null);
  const applyRef = useRef(null);

  const overviewInView = useInView(overviewRef, { once: true, margin: "-80px" });
  const modulesInView = useInView(modulesRef, { once: true, margin: "-80px" });
  const outcomesInView = useInView(outcomesRef, { once: true, margin: "-80px" });
  const applyInView = useInView(applyRef, { once: true, margin: "-80px" });

  const form = useForm<z.infer<typeof applySchema>>({
    resolver: zodResolver(applySchema),
    defaultValues: { name: "", phone: "", email: "", education: "", message: "" }
  });

  function onSubmit() {
    toast({ title: "Application Submitted!", description: "Our admissions team will contact you within 24 hours." });
    form.reset();
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section ref={heroRef} className="hero-gradient section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center text-white space-y-6 max-w-4xl mx-auto">
            <motion.span variants={fadeUp} className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">Flagship Program</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-bold leading-tight">
              Private Banking & Finance<br /><span className="text-gold">Excellence Program</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-xl font-light italic">"Not Just a Job — A Career That Lasts"</motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6">
              {[{ icon: Clock, label: "Duration", val: "2 Months" }, { icon: Users, label: "Eligibility", val: "Any Graduate" }, { icon: Award, label: "Placement", val: "100% Rate" }, { icon: BookOpen, label: "Modules", val: "8 Modules" }].map(({ icon: Icon, label, val }) => (
                <div key={label} className="glass-card px-5 py-3 text-center min-w-[120px]">
                  <Icon className="text-secondary mx-auto mb-1" size={20} />
                  <div className="text-xs text-blue-200">{label}</div>
                  <div className="font-semibold text-sm mt-0.5">{val}</div>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <a href="#apply">
                <Button size="lg" className="gold-gradient text-white rounded-full px-8 py-5 font-semibold hover:scale-105 transition-transform cursor-pointer">
                  Apply Now <ArrowRight className="ml-2" size={18} />
                </Button>
              </a>
              <a href="#curriculum">
                <Button size="lg" variant="outline" className="border-white/40 text-white rounded-full px-8 py-5 bg-white/10 hover:bg-white/20 cursor-pointer">
                  View Curriculum
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/></svg></div>
      </section>

      {/* Overview */}
      <section ref={overviewRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={overviewInView ? "visible" : "hidden"} variants={stagger} className="grid lg:grid-cols-2 gap-7 items-start">
            <motion.div variants={fadeUp} className="space-y-6">
              <div>
                <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Program Overview</span>
                <h2 className="font-serif text-4xl font-bold text-primary mt-3">What Makes This Program Different</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">While most training programs teach you how to crack an interview, the Private Banking & Finance Excellence Program teaches you how to survive, thrive, and grow once you are in.</p>
              <p className="text-muted-foreground leading-relaxed">Our faculty are active and retired senior private banking professionals — not teachers. Every session is built on real-world private banking scenarios, live case studies, and simulated private banking environments. When you walk into your first day at work, you will have the confidence of someone who has already been there.</p>
              <div className="grid grid-cols-2 gap-4">
                {[{ label: "Duration", val: "2 Months Intensive" }, { label: "Mode", val: "Full-Time Classroom" }, { label: "Eligibility", val: "Any Graduate / Final Year" }, { label: "Batch Size", val: "Limited (30 Students)" }].map(({ label, val }) => (
                  <div key={label} className="bg-primary/5 rounded-2xl p-4">
                    <div className="text-muted-foreground text-xs">{label}</div>
                    <div className="font-semibold text-primary text-sm mt-1">{val}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-4">
              <h3 className="font-serif font-bold text-primary text-xl mb-2">Who Should Join</h3>
              {["Fresh graduates aspiring to enter the private banking and finance sector", "Final year students wanting to be job-ready before graduation", "Working professionals looking to transition into private banking or NBFCs", "Candidates who have attempted bank exams but want an alternative entry route", "Anyone seeking a structured, industry-aligned pathway to a private banking career"].map((item) => (
                <div key={item} className="flex gap-3 items-start bg-white rounded-xl p-4 border border-border shadow-sm">
                  <CheckCircle className="text-secondary shrink-0 mt-0.5" size={18} />
                  <span className="text-muted-foreground text-sm">{item}</span>
                </div>
              ))}
              <div className="mt-6 bg-secondary/10 rounded-2xl p-5 border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-secondary text-secondary" />)}
                </div>
                <p className="text-sm text-foreground italic">"I joined TBA with zero knowledge of private banking. Two months later I was placed at Axis Bank as a Relationship Manager. A year on, I was promoted."</p>
                <div className="mt-3 text-sm font-semibold text-primary">— Rahul Mehta, Axis Bank (Batch 2023)</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" ref={modulesRef} className="section-padding bg-primary/[0.03]">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={modulesInView ? "visible" : "hidden"} variants={fadeUp} className="text-center mb-7">
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Curriculum</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mt-3">8 Comprehensive Modules</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Every module is designed by industry practitioners to reflect current private banking practices, regulatory requirements, and market realities.</p>
          </motion.div>
          <motion.div initial="hidden" animate={modulesInView ? "visible" : "hidden"} variants={stagger} className="space-y-4">
            {modules.map(({ num, title, topics }, i) => (
              <motion.div key={num} variants={fadeUp}>
                <button
                  className="w-full text-left bg-white rounded-2xl border border-border shadow-sm p-6 hover:border-secondary/30 transition-all"
                  onClick={() => setActiveModule(activeModule === i ? null : i)}
                  data-testid={`module-toggle-${num}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary text-sm">{num}</span>
                      </div>
                      <h3 className="font-serif font-bold text-primary text-lg">{title}</h3>
                    </div>
                    <ChevronDown className={`text-muted-foreground shrink-0 transition-transform ${activeModule === i ? "rotate-180" : ""}`} size={20} />
                  </div>
                  {activeModule === i && (
                    <div className="mt-4 pl-14 grid sm:grid-cols-2 gap-2">
                      {topics.map((t) => (
                        <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle size={14} className="text-secondary shrink-0" />
                          {t}
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section ref={outcomesRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div initial="hidden" animate={outcomesInView ? "visible" : "hidden"} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-8">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">What You Will Gain</span>
              <h2 className="font-serif text-4xl font-bold text-primary mt-3">Learning Outcomes</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid md:grid-cols-2 gap-4">
              {outcomes.map((o, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-primary/5 rounded-2xl p-5 border border-primary/10">
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-secondary font-bold text-xs">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <span className="text-foreground text-sm leading-relaxed">{o}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Placement Support */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="md:col-span-1">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">After The Program</span>
              <h2 className="font-serif text-3xl font-bold mt-3">Placement Support</h2>
              <p className="text-blue-100 mt-4 leading-relaxed text-sm">Our placement cell works tirelessly to connect students with the right opportunity at the right organisation.</p>
            </div>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {["Resume & LinkedIn Profile Review", "Mock Interview Rounds (3+)", "Group Discussion Practice", "Placement Drives with 20+ Partners", "Personal Referrals from Faculty", "Post-Placement Career Guidance"].map((s) => (
                <div key={s} className="glass-card p-4 flex items-center gap-3">
                  <CheckCircle className="text-secondary shrink-0" size={18} />
                  <span className="text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program FAQs */}
      <section id="faq" className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-serif text-4xl font-bold text-primary">Program FAQs</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-2xl border border-border px-6 shadow-sm">
                <AccordionTrigger className="font-semibold text-primary text-left py-5 hover:no-underline hover:text-secondary transition-colors">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" ref={applyRef} className="section-padding bg-primary/[0.03]">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <motion.div initial="hidden" animate={applyInView ? "visible" : "hidden"} variants={fadeUp} className="text-center mb-8">
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Get Started</span>
            <h2 className="font-serif text-4xl font-bold text-primary mt-3">Apply for the Program</h2>
            <p className="text-muted-foreground mt-3">Fill in your details and our admissions team will reach out within 24 hours.</p>
          </motion.div>
          <motion.div initial="hidden" animate={applyInView ? "visible" : "hidden"} variants={fadeUp} className="bg-white rounded-3xl p-8 border border-border shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel className="text-primary font-medium">Full Name</FormLabel><FormControl><Input placeholder="Your full name" className="rounded-xl" data-testid="input-name" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel className="text-primary font-medium">Phone Number</FormLabel><FormControl><Input placeholder="+91-6306286395" className="rounded-xl" data-testid="input-phone" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel className="text-primary font-medium">Email Address</FormLabel><FormControl><Input type="email" placeholder="you@email.com" className="rounded-xl" data-testid="input-email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="education" render={({ field }) => (
                  <FormItem><FormLabel className="text-primary font-medium">Educational Qualification</FormLabel><FormControl><Input placeholder="e.g. B.Com, BBA, MBA" className="rounded-xl" data-testid="input-education" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem><FormLabel className="text-primary font-medium">Message (Optional)</FormLabel><FormControl><Textarea placeholder="Any specific questions or requirements..." className="rounded-xl resize-none" rows={3} data-testid="input-message" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" size="lg" className="w-full gold-gradient text-white rounded-xl font-semibold cursor-pointer" data-testid="button-submit-apply">
                  Submit Application <ArrowRight className="ml-2" size={18} />
                </Button>
                <p className="text-center text-xs text-muted-foreground">By submitting, you agree to our <Link href="/privacy-policy" className="text-secondary hover:underline">Privacy Policy</Link>.</p>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
