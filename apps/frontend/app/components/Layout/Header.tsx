"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                alt="Propalytiq Logo"
                src="/images/proplytiq-logo.png"
                width={200}
                height={48}
                className="h-10 w-auto sm:h-8 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link
                href="/how-it-works"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" asChild>
                  <button>Login</button>
                </Button>
              </SignInButton>
            </SignedOut>
            <Button asChild className="purple-gradient-bg">
              <Link href="/analysis">Start Analysis</Link>
            </Button>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10",
                    userButtonPopoverCard: "p-2",
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <SignedOut>
              <div className="md:hidden">
                <SignInButton mode="modal">
                  <Button variant="outline" asChild>
                    <button className="p-2">Login</button>
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="md:hidden">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-8 w-8",
                      userButtonPopoverCard: "m-2",
                    },
                  }}
                />
              </div>
            </SignedIn>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/reports"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Reports
              </Link>
              <Link
                href="/billing"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Billing
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="px-3 py-2 space-y-2">
                <Button asChild className="w-full purple-gradient-bg">
                  <Link href="/analysis" onClick={() => setIsMenuOpen(false)}>
                    Start Analysis
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
