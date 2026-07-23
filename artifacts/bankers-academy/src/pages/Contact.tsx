import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

const contactInfo = [
  { icon: MapPin, title: "Our Office", details: ["First Floor Dev Residency,", "Plot No.803, P Block, Kakadeo,", "Kanpur, 208025"] },
  { icon: Phone, title: "Call Us", details: ["+91-6306286395"] },
  { icon: Mail, title: "Email Us", details: ["admissions@thebankersacademy.org"] },
  { icon: Clock, title: "Working Hours", details: ["Monday – Saturday", "9:00 AM – 6:00 PM", "Sunday: Closed"] }
];

export default function Contact() {
  useEffect(() => { document.title = "Contact Us — The Bankers Academy LLP"; }, []);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-80px" });
  const infoInView = useInView(infoRef, { once: true, margin: "-80px" });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", subject: "", message: "" }
  });

  async function onSubmit(values: z.infer<typeof schema>) {
  setSubmitting(true);

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}api/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: values.name,
        phone: values.phone,
        email: values.email,
        courseInterest: values.subject || null,
        message: values.message,
        sourcePage: "contact",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit enquiry");
    }

    toast({
      title: "Message Sent!",
      description: "We will get back to you within 24 working hours.",
    });

    form.reset();
  } catch (err) {
    console.error(err);

    toast({
      title: "Submission Failed",
      description: "Please try again later or contact us directly.",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
}

  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-4">
            <motion.span variants={fadeUp} className="inline-block px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-sm font-medium">Get In Touch</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif text-5xl md:text-6xl font-bold">Contact Us</motion.h1>
            <motion.p variants={fadeUp} className="text-blue-100 text-lg max-w-2xl mx-auto">Have questions about our program or admissions? Our team is ready to help you take the next step.</motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F8FAFC"/></svg></div>
      </section>

      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-7">
          {/* Contact Info */}
          <motion.div ref={infoRef} initial="hidden" animate={infoInView ? "visible" : "hidden"} variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp}>
              <span className="text-secondary text-sm font-semibold tracking-widest uppercase">Reach Us</span>
              <h2 className="font-serif text-4xl font-bold text-primary mt-3">We Are Here to Help</h2>
              <p className="text-muted-foreground mt-3 leading-relaxed">Whether you have questions about admission, curriculum, fees, or placements — our counsellors are here to guide you through every step.</p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-4">
              {contactInfo.map(({ icon: Icon, title, details }) => (
                <motion.div key={title} variants={fadeUp} className="flex gap-4 bg-white rounded-2xl p-5 border border-border shadow-sm hover:border-secondary/30 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <Icon className="text-secondary" size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{title}</div>
                    {details.map((d, i) => <div key={i} className="text-muted-foreground text-sm">{d}</div>)}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.a
              variants={fadeUp}
              href="https://wa.me/916306286395"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 text-white rounded-2xl p-4 hover:bg-green-600 transition-colors"
              data-testid="link-whatsapp"
            >
              <MessageCircle size={22} />
              <div>
                <div className="font-semibold">Chat on WhatsApp</div>
                <div className="text-green-100 text-sm">Quick responses during working hours</div>
              </div>
              <ArrowRight className="ml-auto" size={18} />
            </motion.a>

            {/* Map placeholder */}
            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden border border-border shadow-sm h-52 bg-primary/10 flex items-center justify-center relative">
              <div className="absolute inset-0 hero-gradient opacity-80" />
              <div className="relative z-10 text-center text-white">
                <MapPin size={32} className="mx-auto mb-2 text-secondary" />
                <div className="font-semibold">The Bankers Academy LLP</div>
                <div className="text-blue-100 text-sm">Kakadeo, Kanpur, 208025</div>
                <div className="mt-2 text-xs text-blue-200">Click to open in Google Maps</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div ref={formRef} initial="hidden" animate={formInView ? "visible" : "hidden"} variants={fadeUp}>
            <div className="bg-white rounded-3xl border border-border shadow-lg p-8">
              <h3 className="font-serif text-2xl font-bold text-primary mb-6">Send Us a Message</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel className="text-primary font-medium">Full Name</FormLabel><FormControl><Input placeholder="Your name" className="rounded-xl" data-testid="input-contact-name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel className="text-primary font-medium">Phone Number</FormLabel><FormControl><Input placeholder="+91-6306286395" className="rounded-xl" data-testid="input-contact-phone" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel className="text-primary font-medium">Email Address</FormLabel><FormControl><Input type="email" placeholder="you@email.com" className="rounded-xl" data-testid="input-contact-email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel className="text-primary font-medium">Subject</FormLabel><FormControl><Input placeholder="e.g. Admission Enquiry" className="rounded-xl" data-testid="input-contact-subject" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel className="text-primary font-medium">Your Message</FormLabel><FormControl><Textarea placeholder="Tell us how we can help you..." className="rounded-xl resize-none" rows={5} data-testid="input-contact-message" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button
  type="submit"
  size="lg"
  disabled={submitting}
  className="w-full gold-gradient text-white rounded-xl font-semibold cursor-pointer"
  data-testid="button-contact-submit"
>
  {submitting ? (
    "Sending..."
  ) : (
    <>
      Send Message
      <ArrowRight className="ml-2" size={18} />
    </>
  )}
</Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
