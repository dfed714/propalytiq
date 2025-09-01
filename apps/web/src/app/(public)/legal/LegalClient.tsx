'use client';

import { AlertTriangle } from 'lucide-react';
import React from 'react';

const LegalClient = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
          <h1 className="text-2xl font-bold text-yellow-800">Important Legal Notice</h1>
        </div>
        <p className="text-yellow-700 font-medium">
          This service does NOT constitute financial advice. Please read the full disclaimer below.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold mb-6">Financial Services Disclaimer</h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3">No Financial Advice</h3>
            <p className="text-gray-700 leading-relaxed">
              Propalytiq is an analytical tool that provides property investment analysis and data interpretation.
              The information, analysis, reports, and insights provided by our platform are for informational and
              educational purposes only and do not constitute financial advice, investment advice, or recommendations
              to buy, sell, or hold any property or investment.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Not Regulated Investment Advice</h3>
            <p className="text-gray-700 leading-relaxed">
              Propalytiq is not authorised or regulated by the Financial Conduct Authority (FCA) to provide
              investment advice. Our services do not constitute regulated activities under the Financial Services
              and Markets Act 2000 (FSMA). We do not provide personal recommendations or advice on the merits
              of particular investments or investment strategies.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Your Own Due Diligence Required</h3>
            <p className="text-gray-700 leading-relaxed">
              Before making any property investment decision, you should:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>Conduct your own independent research and due diligence</li>
              <li>Seek advice from qualified, FCA-regulated financial advisers</li>
              <li>Consult with solicitors, surveyors, and other property professionals</li>
              <li>Consider your personal financial circumstances and risk tolerance</li>
              <li>Obtain independent valuations and legal advice</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Risk Warnings</h3>
            <p className="text-gray-700 leading-relaxed">
              Property investment carries significant risks, including but not limited to:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>Property values can fall as well as rise</li>
              <li>Rental income is not guaranteed</li>
              <li>Properties may experience void periods</li>
              <li>Maintenance and repair costs can be substantial</li>
              <li>Interest rates and market conditions can adversely affect returns</li>
              <li>You may not be able to sell a property when desired</li>
              <li>You could lose some or all of your investment</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Data Accuracy and Limitations</h3>
            <p className="text-gray-700 leading-relaxed">
              While we strive to provide accurate analysis based on available data, we cannot guarantee the
              accuracy, completeness, or timeliness of the information provided. Property markets are subject
              to rapid change, and historical performance is not indicative of future results. Our analysis
              is based on publicly available information and algorithmic interpretation, which may not capture
              all relevant factors affecting a property investment.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Professional Advice Required</h3>
            <p className="text-gray-700 leading-relaxed">
              For investment advice tailored to your personal circumstances, you should consult with:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>FCA-authorised independent financial advisers</li>
              <li>Qualified chartered surveyors (RICS members)</li>
              <li>Solicitors specialising in property law</li>
              <li>Accountants for tax implications</li>
              <li>Mortgage brokers for financing options</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, Propalytiq excludes all liability for any loss or damage
              arising from your use of our platform or reliance on the information provided. This includes,
              but is not limited to, direct, indirect, incidental, consequential, or special damages, loss of
              profits, or loss of investment value.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Regulatory Information</h3>
            <p className="text-gray-700 leading-relaxed">
              If you require regulated financial advice, please ensure any adviser you consult is authorised
              by the Financial Conduct Authority. You can check this on the FCA register at{' '}
              <a
                href="https://register.fca.org.uk"
                className="text-purple-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                register.fca.org.uk
              </a>
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this disclaimer or our services, please contact us through our
              official channels. This disclaimer is governed by English law and is subject to the exclusive
              jurisdiction of the English courts.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalClient;
