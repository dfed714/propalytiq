import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link href="/" className="block mb-3">
              <Image
                alt="Propalytiq Logo"
                src="/images/proplytiq-logo.png"
                width={200}
                height={48}
                className="h-10 w-auto sm:h-8 object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-md">
              Modern commercial and residential property investment analysis
              powered by artificial intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-disclaimer"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/billing"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Billing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-3 sm:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Propalytiq. All rights reserved.
          </p>
          <div>
            <p className="text-sm text-gray-500">
              Prototype version. No real AI functionality implemented.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
