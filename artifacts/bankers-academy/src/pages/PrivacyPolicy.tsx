import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy — The Bankers Academy LLP";
  }, []);
  return (
    <div className="overflow-hidden">
      <section className="hero-gradient py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-serif text-5xl font-bold">Privacy Policy</h1>
            <p className="text-blue-100 mt-3">Last updated: June 2026</p>
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
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-slate max-w-none"
          >
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  1. Introduction
                </h2>
                <p>
                  The Bankers Academy LLP ("we", "us", "our") is committed to
                  protecting the privacy of every individual who interacts with
                  our website, programs, and services. This Privacy Policy
                  explains how we collect, use, store, and protect your personal
                  information when you visit our website or enrol in our
                  programs.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  2. Information We Collect
                </h2>
                <p>We collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>
                    <strong>Personal Identification Information:</strong> Name,
                    date of birth, email address, phone number, city, and
                    educational qualifications — collected when you submit an
                    application, enquiry, or contact form.
                  </li>
                  <li>
                    <strong>Professional Information:</strong> Work experience,
                    current employer, and career goals — collected during the
                    admission and counselling process.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> IP address, browser type,
                    device information, and pages visited — collected
                    automatically through standard web analytics tools.
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Emails, messages, and
                    feedback you send us.
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  3. How We Use Your Information
                </h2>
                <p>We use your personal information to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>
                    Process and respond to your enquiries, applications, and
                    admission requests
                  </li>
                  <li>
                    Contact you with information about our programs, batches,
                    and updates
                  </li>
                  <li>
                    Facilitate placement support and connect you with hiring
                    partners (with your consent)
                  </li>
                  <li>Improve our website, curriculum, and services</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>
                    Send you relevant educational resources, career guidance,
                    and newsletters (you may opt out at any time)
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  4. Sharing of Information
                </h2>
                <p>
                  We do not sell, rent, or trade your personal information to
                  third parties. We may share your information in the following
                  circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>
                    <strong>With your consent:</strong> We share relevant
                    profile information with our hiring partner organisations
                    for placement purposes, only with your explicit agreement.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> With trusted third-party
                    service providers who assist us in website operations, email
                    communications, or analytics — subject to confidentiality
                    obligations.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> Where required by law,
                    court order, or regulatory authorities.
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organisational measures
                  to protect your personal information against unauthorised
                  access, alteration, disclosure, or destruction. While we
                  strive to protect your information, no method of transmission
                  over the internet is 100% secure.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  6. Cookies
                </h2>
                <p>
                  Our website uses cookies to enhance your browsing experience,
                  analyse site traffic, and personalise content. You can choose
                  to disable cookies through your browser settings, though this
                  may affect the functionality of certain parts of our website.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  7. Your Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate or incomplete data</li>
                  <li>
                    Request deletion of your personal data (subject to legal
                    requirements)
                  </li>
                  <li>
                    Withdraw consent for marketing communications at any time
                  </li>
                  <li>
                    Lodge a complaint with the relevant data protection
                    authority
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  8. Retention
                </h2>
                <p>
                  We retain personal information for as long as necessary to
                  fulfil the purposes outlined in this policy, unless a longer
                  retention period is required or permitted by law. Student
                  records are typically retained for 7 years after program
                  completion.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  9. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Any
                  changes will be posted on this page with an updated "Last
                  Updated" date. We encourage you to review this policy
                  periodically.
                </p>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                  10. Contact Us
                </h2>
                <p>
                  If you have any questions, concerns, or requests regarding
                  your personal information or this Privacy Policy, please
                  contact us:
                </p>
                <div className="mt-3 bg-primary/5 rounded-2xl p-5 border border-border">
                  <div className="font-semibold text-primary">
                    The Bankers Academy LLP
                  </div>
                  <div>
                    First Floor Dev Residency, Plot No.803, P Block, Kakadeo,
                    Kanpur, 208025
                  </div>
                  <div>Email: admissions@thebankersacademy.org</div>
                  <div>Phone: +91-6306286395</div>
                </div>
              </div>
            </div>
          </motion.div>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="text-secondary hover:underline font-medium"
            >
              Contact Us for Privacy Concerns →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
