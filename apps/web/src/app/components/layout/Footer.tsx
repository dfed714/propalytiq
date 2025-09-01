"use client";

import Link from "next/link";
import Image from "next/image";

interface FooterProps {
  isAuthenticated?: boolean;
}

const Footer = ({ isAuthenticated = false }: FooterProps) => {
  return (
    <footer
      className={`bg-gray-50 border-t py-8 sm:py-12 ${
        isAuthenticated ? "md:pl-16" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link href="/" className="block mb-3">
              <Image
                alt="Propalytiq Logo"
                src="/images/propalytiq-logo.png"
                className="h-8 sm:h-8 object-contain"
                width={132}
                height={32}
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
                  href="/terms"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-gray-600 hover:text-primary transition-colours text-sm"
                >
                  Legal Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-3 sm:space-y-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Propalytiq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
