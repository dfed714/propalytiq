"use client";

import React from "react";

const TermsClient = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Propalytiq ("we," "our," or "us"). By accessing or using
          our property analysis services, website, and applications
          (collectively, the "Services"), you agree to be bound by these Terms
          of Service.
        </p>

        <h2>2. Use of Services</h2>
        <p>
          Our Services provide AI-powered analysis of commercial and residential
          property investments. You may use our Services only for lawful
          purposes and in accordance with these Terms.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and
          complete information. You are responsible for maintaining the
          confidentiality of your account credentials.
        </p>

        <h2>4. Subscription and Payment</h2>
        <p>
          Certain features of our Services require a paid subscription. Billing
          terms are described at the time of purchase. Subscriptions
          automatically renew unless cancelled before the renewal date.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All content, features, and functionality of our Services are owned by
          Propalytiq and are protected by international copyright, trademark,
          and other intellectual property laws.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          Our Services provide analyses and recommendations, but investment
          decisions are ultimately your responsibility. We shall not be liable
          for any losses resulting from your investment decisions.
        </p>

        <h2>7. Disclaimer of Investment Advice</h2>
        <p>
          The information provided through our Services does not constitute
          financial or investment advice. Propalytiq is not authorised by the
          Financial Conduct Authority (FCA) to provide investment advice. The
          analyses, reports, and recommendations provided are for informational
          purposes only.
        </p>

        <h2>8. No Warranty for Accuracy</h2>
        <p>
          While we strive to provide accurate information, Propalytiq does not
          warrant or guarantee the accuracy, completeness, or reliability of any
          data, analyses, or recommendations. Property investment involves
          risks, and past performance is not indicative of future results.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We may revise these Terms at any time. The most current version will
          be posted on our website with the effective date.
        </p>

        <h2>10. Termination</h2>
        <p>
          We may terminate or suspend your account and access to our Services
          for violation of these Terms or for any other reason at our
          discretion.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of England and Wales, without regard to its conflict of law
          provisions. Any dispute arising under these Terms shall be subject to
          the exclusive jurisdiction of the courts of England and Wales.
        </p>

        <h2>12. Contact Information</h2>
        <p>
          For questions about these Terms, please contact us at{" "}
          <a
            href="mailto:support@propalytiq.com"
            className="text-purple-600 underline"
          >
            support@propalytiq.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default TermsClient;
