"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Menu, X, User, Settings, CreditCard, LogOut } from "lucide-react";
import SignOutButton from "./SignOutButton";

interface HeaderProps {
  isAuthenticated: boolean;
  firstName?: string;
}

const Header = ({ isAuthenticated, firstName }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                alt="Propalytiq"
                src="/images/propalytiq-logo.png"
                className="h-8 sm:h-8 object-contain"
                width={150}
                height={32}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link
                href="/how-it-works"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                How It Works
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
            {isAuthenticated ? (
              <>
                <Button asChild className="purple-gradient-bg">
                  <Link href="/analysis">Start Analysis</Link>
                </Button>
                <span className="hidden lg:block text-gray-700 font-medium">
                  Hi, {firstName}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48" align="end">
                    <div className="flex flex-col space-y-1">
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/billing">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Billing
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link href="/">
                          <LogOut className="h-4 w-4 mr-2" />
                          <SignOutButton />
                        </Link>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="purple-gradient-bg">
                  <Link href="/analysis">Start Analysis</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="flex flex-col space-y-1">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/billing">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Billing
                      </Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link href="/">
                        <LogOut className="h-4 w-4 mr-2" />
                        <SignOutButton />
                      </Link>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <button
              className="p-2"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <div className="px-3 py-3">
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Navigation
                </h3>
              </div>
              <Link
                href="/how-it-works"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
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

              {isAuthenticated && (
                <>
                  <div className="px-3 py-3 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </h3>
                  </div>
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
                    href="/analysis"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analysis
                  </Link>

                  <div className="px-3 py-3 border-t border-gray-100">
                    <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Account
                    </h3>
                  </div>
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
                </>
              )}

              <div className="px-3 py-2 space-y-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
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
