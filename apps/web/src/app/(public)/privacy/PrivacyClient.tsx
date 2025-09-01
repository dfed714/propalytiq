"use client";

import React from "react";

const PrivacyClient = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <h2>1. Introduction</h2>
        <p>
          At Propalytiq, we take your privacy seriously. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you use our property analysis services.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us
          when you register, express interest in our products, or otherwise
          contact us. This may include:
        </p>
        <ul>
          <li>Contact information (name, email address, phone number)</li>
          <li>Account credentials</li>
          <li>Property details you submit for analysis</li>
          <li>Payment information</li>
          <li>Usage data and analytics</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, maintain, and improve our Services</li>
          <li>Process your transactions</li>
          <li>Send you service-related notifications</li>
          <li>Respond to your comments and questions</li>
          <li>Protect against fraudulent or illegal activity</li>
          <li>Personalise your experience</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organisational measures to
          protect your personal information against unauthorised access,
          alteration, disclosure, or destruction.
        </p>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect
          information about your browsing activities and to remember your
          preferences.
        </p>

        <h2>6. Third-Party Services</h2>
        <p>
          We may use third-party service providers to help us operate our
          business and the Services or administer activities on our behalf.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Under UK data protection law, you have rights regarding your personal
          information, including:
        </p>
        <ul>
          <li>The right to access the personal data we hold about you</li>
          <li>The right to rectify inaccurate personal data</li>
          <li>The right to request erasure of your personal data</li>
          <li>The right to restrict processing of your personal data</li>
          <li>The right to data portability</li>
          <li>The right to object to processing</li>
        </ul>

        <h2>8. Data Protection Officer</h2>
        <p>
          We have appointed a Data Protection Officer (DPO) who is responsible
          for overseeing questions about this Privacy Policy. If you have any
          questions about this Privacy Policy, including any requests to
          exercise your legal rights, please contact our DPO at{" "}
          <a
            href="mailto:privacy@propalytiq.com"
            className="text-purple-600 underline"
          >
            privacy@propalytiq.com
          </a>
          .
        </p>

        <h2>9. Children's Privacy</h2>
        <p>
          Our Services are not intended for individuals under the age of 18. We
          do not knowingly collect personal information from children.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. The updated version
          will be indicated by an updated "Revised" date.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a
            href="mailto:privacy@propalytiq.com"
            className="text-purple-600 underline"
          >
            privacy@propalytiq.com
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyClient;
