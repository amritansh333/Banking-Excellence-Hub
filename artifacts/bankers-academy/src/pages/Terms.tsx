import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms & Conditions — The Bankers Academy LLP";
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
            <h1 className="font-serif text-5xl font-bold">
              Terms & Conditions
            </h1>
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
            className="space-y-8 text-muted-foreground leading-relaxed"
          >
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing this website, enrolling in any program, or engaging
                with the services of The Bankers Academy LLP ("the Academy"),
                you agree to be bound by these Terms and Conditions. If you do
                not agree with any part of these terms, please do not use our
                services or website.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                2. Program Enrolment
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Enrolment in any program is subject to availability of seats
                  in the chosen batch and completion of the admission process.
                </li>
                <li>
                  The Academy reserves the right to refuse admission to any
                  applicant without providing a reason.
                </li>
                <li>
                  A confirmed seat is only secured upon full or agreed partial
                  payment of the program fee.
                </li>
                <li>
                  Students must be graduates or final-year undergraduates at the
                  time of enrolment.
                </li>
                <li>
                  Providing false or misleading information during the admission
                  process may result in immediate termination of enrolment
                  without refund.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                3. Fees & Payment
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Program fees are as communicated by the admissions team at the
                  time of counselling.
                </li>
                <li>
                  Fees may be paid in instalments as per the payment plan agreed
                  upon at the time of admission.
                </li>
                <li>
                  All fees are inclusive of course materials, assessments, and
                  placement support services.
                </li>
                <li>Fee receipts will be issued for all payments made.</li>
                <li>
                  The Academy reserves the right to revise fees for future
                  batches with reasonable notice.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                4. Refund Policy
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Requests for refund submitted more than 7 days before batch
                  commencement: 75% of fees refunded.
                </li>
                <li>
                  Requests submitted within 7 days of batch commencement: 50% of
                  fees refunded.
                </li>
                <li>
                  No refund will be provided once the program has commenced
                  beyond 3 days.
                </li>
                <li>
                  In the event the Academy cancels a batch, full fees will be
                  refunded or the student may transfer to the next available
                  batch.
                </li>
                <li>Application fees (if any) are non-refundable.</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                5. Attendance & Conduct
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Students are expected to maintain a minimum of 80% attendance
                  throughout the program to be eligible for the certificate and
                  placement support.
                </li>
                <li>
                  Students must conduct themselves professionally at all times,
                  both inside the academy and during placement interactions.
                </li>
                <li>
                  Any form of harassment, cheating, or disruptive behaviour may
                  result in dismissal from the program without refund.
                </li>
                <li>
                  Mobile phone usage is restricted during sessions unless
                  authorised by the instructor.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                6. Placement Support
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Academy provides placement assistance and not a placement
                  guarantee. Placement outcomes depend on individual
                  performance, market conditions, and employer requirements.
                </li>
                <li>
                  Students must actively participate in placement preparation
                  activities, mock interviews, and drives to avail placement
                  support.
                </li>
                <li>
                  The Academy's placement support is valid for 12 months from
                  program completion date.
                </li>
                <li>
                  Once a student accepts an offer through the Academy's
                  placement network, further placement assistance may be
                  discontinued.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                7. Certification
              </h2>
              <p>
                The Certificate of Completion from The Bankers Academy LLP will
                be issued to students who:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Complete the full 2-month program duration</li>
                <li>Maintain the minimum attendance requirement of 80%</li>
                <li>
                  Clear all internal assessments and practical evaluations
                </li>
                <li>Clear all pending fee dues at the time of certification</li>
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                8. Intellectual Property
              </h2>
              <p>
                All training materials, presentations, case studies, and
                resources provided by the Academy are proprietary and protected
                under applicable intellectual property laws. Students may not
                reproduce, distribute, or commercialise any materials without
                prior written consent from the Academy.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                The Bankers Academy LLP shall not be liable for any indirect,
                incidental, special, or consequential damages arising from
                enrolment in or completion of our programs, including but not
                limited to loss of employment opportunity or income. Our total
                liability in any circumstance shall not exceed the fees paid by
                the student for the program in question.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                10. Governing Law
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in
                accordance with the laws of India. Any disputes arising under
                these terms shall be subject to the exclusive jurisdiction of
                the courts in Kanpur, Uttar Pradesh.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                11. Amendments
              </h2>
              <p>
                The Academy reserves the right to amend these Terms and
                Conditions at any time. Updated terms will be posted on this
                page. Continued use of our services after any changes
                constitutes acceptance of the revised terms.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-3">
                12. Contact
              </h2>
              <div className="bg-primary/5 rounded-2xl p-5 border border-border">
                <div className="font-semibold text-primary">
                  The Bankers Academy LLP
                </div>
                <div>
                  First Floor Dev Residency, Plot No.803, P Block, Kakadeo,
                  Kanpur, 208025
                </div>
                <div>
                  Email: admissions@thebankersacademy.org | Phone:
                  +91-6306286395
                </div>
              </div>
            </div>
          </motion.div>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className="text-secondary hover:underline font-medium"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
