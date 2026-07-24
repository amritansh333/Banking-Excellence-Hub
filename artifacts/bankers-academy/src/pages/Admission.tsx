import { useEffect, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  ArrowRight,
  GraduationCap,
  FileText,
  UserCheck,
  CreditCard,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const eligibility = [
  {
    icon: GraduationCap,
    title: "Education",
    desc: "Any graduate (BA, B.Com, BBA, BSc, BE, etc.) or final year student. No specific stream required.",
  },
  {
    icon: Calendar,
    title: "Age",
    desc: "No upper age limit. We welcome fresh graduates as well as working professionals looking to switch.",
  },
  {
    icon: FileText,
    title: "Documents",
    desc: "Graduation marksheets/degree, ID proof, recent passport photographs.",
  },
  {
    icon: UserCheck,
    title: "Attitude",
    desc: "A willingness to learn, strong communication intent, and commitment to the 2-month program.",
  },
];

const admissionSteps = [
  {
    step: "01",
    icon: FileText,
    title: "Fill the Application",
    desc: "Complete the online application form below with your personal and educational details.",
  },
  {
    step: "02",
    icon: UserCheck,
    title: "Counselling Call",
    desc: "Our admissions counsellor will call you within 24 hours to understand your background and goals.",
  },
  {
    step: "03",
    icon: GraduationCap,
    title: "Document Submission",
    desc: "Submit your educational documents for verification. This can be done in-person or via email.",
  },
  {
    step: "04",
    icon: CreditCard,
    title: "Fee Payment & Confirmation",
    desc: "Complete the fee formalities to confirm your seat. Your batch and schedule will be shared on confirmation.",
  },
];

const batches = [
  {
    name: "August 2026 Batch",
    startDate: "August 3, 2026",
    lastDate: "July 27, 2026",
    seats: "12 seats remaining",
    status: "Open",
  },
  {
    name: "September 2026 Batch",
    startDate: "September 1, 2026",
    lastDate: "August 22, 2026",
    seats: "30 seats available",
    status: "Accepting Applications",
  },
  {
    name: "October 2026 Batch",
    startDate: "October 5, 2026",
    lastDate: "September 26, 2026",
    seats: "30 seats available",
    status: "Upcoming",
  },
];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  dob: z.string().min(1, "Date of birth is required"),
  education: z.string().min(2, "Education qualification is required"),
  college: z.string().min(2, "College/University name is required"),
  city: z.string().min(2, "City is required"),
  experience: z.string().optional(),
  message: z.string().optional(),
});

export default function Admission() {
  useEffect(() => {
    document.title = "Admissions — The Bankers Academy LLP";
  }, []);
  const { toast } = useToast();
  const eligibilityRef = useRef(null);
  const processRef = useRef(null);
  const batchesRef = useRef(null);
  const formRef = useRef(null);
  const eligibilityInView = useInView(eligibilityRef, {
    once: true,
    margin: "-80px",
  });
  const processInView = useInView(processRef, { once: true, margin: "-80px" });
  const batchesInView = useInView(batchesRef, { once: true, margin: "-80px" });
  const formInView = useInView(formRef, { once: true, margin: "-80px" });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      dob: "",
      education: "",
      college: "",
      city: "",
      experience: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: values.name,
          email: values.email,
          phone: values.phone,
          qualification: values.education,
          dob: values.dob,
          college: values.college,
          city: values.city,
          experience: values.experience,

          message: `


Reason:
${values.message || ""}
        `,
          sourcePage: "/admission",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast({
        title: "Application Received!",
        description: "Our admissions team will contact you within 24 hours.",
      });

      form.reset();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again in a few minutes.",
      });

      console.error(err);
    }
  }

  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-4"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium"
            >
              Start Your Journey
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl md:text-6xl font-bold"
            >
              Admissions
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-blue-100 text-lg max-w-2xl mx-auto"
            >
              Your private banking career begins with one step. Apply today for
              our flagship Private Banking & Finance Excellence Program.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none">
            <path
              d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z"
              fill="#F8FAFC"
            />
          </svg>
        </div>
      </section>

      {/* Eligibility */}
      <section ref={eligibilityRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            initial="hidden"
            animate={eligibilityInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-8">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
                Who Can Apply
              </span>
              <h2 className="font-serif text-4xl font-bold text-primary mt-3">
                Eligibility Criteria
              </h2>
              <p className="text-muted-foreground mt-3">
                We believe talent is not determined by stream or marks. Our
                doors are open to all who are serious about a career in private
                banking.
              </p>
            </motion.div>
            <motion.div
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {eligibility.map(({ icon: Icon, title, desc }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="bg-white rounded-3xl p-6 border border-border shadow-sm hover-lift text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-secondary" size={26} />
                  </div>
                  <h3 className="font-serif font-bold text-primary text-lg mb-2">
                    {title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Admission Process */}
      <section ref={processRef} className="section-padding bg-primary/[0.03]">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-8">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
                How to Apply
              </span>
              <h2 className="font-serif text-4xl font-bold text-primary mt-3">
                Admission Process
              </h2>
            </motion.div>
            <motion.div variants={stagger} className="space-y-4">
              {admissionSteps.map(({ step, icon: Icon, title, desc }) => (
                <motion.div
                  key={step}
                  variants={fadeUp}
                  className="flex gap-5 bg-white rounded-2xl p-6 border border-border shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="text-primary" size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-secondary font-bold text-xs tracking-widest">
                        STEP {step}
                      </span>
                      <h3 className="font-serif font-bold text-primary">
                        {title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 self-center">
                    <CheckCircle className="text-secondary" size={18} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Batches */}
      <section ref={batchesRef} className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            animate={batchesInView ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-8">
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
                Upcoming Batches
              </span>
              <h2 className="font-serif text-4xl font-bold text-primary mt-3">
                Batch Schedule 2026
              </h2>
            </motion.div>
            <motion.div variants={stagger} className="space-y-4">
              {batches.map(({ name, startDate, lastDate, seats, status }) => (
                <motion.div
                  key={name}
                  variants={fadeUp}
                  className={`flex items-center justify-between gap-4 rounded-2xl p-6 border shadow-sm ${status === "Open" ? "bg-secondary/5 border-secondary/30" : "bg-white border-border"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${status === "Open" ? "bg-green-500" : status === "Accepting Applications" ? "bg-secondary" : "bg-muted-foreground"}`}
                    />
                    <div>
                      <h3 className="font-serif font-bold text-primary">
                        {name}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-1">
                        <span className="text-muted-foreground text-sm">
                          Starts:{" "}
                          <span className="text-primary font-medium">
                            {startDate}
                          </span>
                        </span>
                        <span className="text-muted-foreground text-sm">
                          Apply by:{" "}
                          <span className="text-primary font-medium">
                            {lastDate}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "Open" ? "bg-green-100 text-green-700" : status === "Accepting Applications" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                    >
                      {status}
                    </span>
                    <div className="text-muted-foreground text-xs mt-1">
                      {seats}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section
        ref={formRef}
        id="apply-form"
        className="section-padding bg-primary/[0.03]"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <motion.div
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-center mb-8"
          >
            <span className="text-secondary text-sm font-semibold tracking-widest uppercase">
              Apply Now
            </span>
            <h2 className="font-serif text-4xl font-bold text-primary mt-3">
              Application Form
            </h2>
            <p className="text-muted-foreground mt-3">
              Fill in your details below. Our admissions team will call you
              within 24 hours to guide you through the next steps.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={fadeUp}
            className="bg-white rounded-3xl border border-border shadow-lg p-8"
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name"
                            className="rounded-xl"
                            data-testid="input-admission-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+91-6306286395"
                            className="rounded-xl"
                            data-testid="input-admission-phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@email.com"
                            className="rounded-xl"
                            data-testid="input-admission-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          Date of Birth *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="rounded-xl"
                            data-testid="input-admission-dob"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          Qualification *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. B.Com, BBA, MBA"
                            className="rounded-xl"
                            data-testid="input-admission-education"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="college"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          College / University *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Name of your college"
                            className="rounded-xl"
                            data-testid="input-admission-college"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          City *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your city"
                            className="rounded-xl"
                            data-testid="input-admission-city"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-medium">
                          Work Experience (if any)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 2 years in retail sales"
                            className="rounded-xl"
                            data-testid="input-admission-experience"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-medium">
                        Why do you want to join TBA?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your goals and aspirations..."
                          className="rounded-xl resize-none"
                          rows={4}
                          data-testid="input-admission-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gold-gradient text-white rounded-xl font-semibold cursor-pointer"
                  data-testid="button-submit-admission"
                >
                  Submit Application <ArrowRight className="ml-2" size={18} />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Your information is safe with us. We will never share your
                  data with third parties.
                </p>
              </form>
            </Form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
