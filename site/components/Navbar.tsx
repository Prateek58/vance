'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  onOpenClientForm?: () => void;
  onOpenCandidateForm?: () => void;
}

export default function Navbar({ onOpenClientForm, onOpenCandidateForm }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-darkBody/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col justify-center group shrink-0">
          <img
            src="/logo.svg"
            alt="Vance IT Solutions"
            className="h-8 sm:h-10 lg:h-12 w-auto max-w-[160px] sm:max-w-[200px] lg:max-w-[240px] object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-[9px] sm:text-[10px] tracking-tight font-medium text-gray-400 group-hover:text-primary transition-colors leading-none mt-0.5">
            Empowering your Tech Journey
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6 xl:space-x-8 text-xs lg:text-sm font-medium whitespace-nowrap">
          <Link
            href="/"
            className={`transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary font-bold' : 'text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link
            href="/client-solutions"
            className={`transition-colors hover:text-primary ${
              isActive('/client-solutions') ? 'text-primary font-bold' : 'text-gray-300'
            }`}
          >
            Client Solutions
          </Link>
          <Link
            href="/candidate-hub"
            className={`transition-colors hover:text-secondary ${
              isActive('/candidate-hub') ? 'text-secondary font-bold' : 'text-gray-300'
            }`}
          >
            Candidate Hub
          </Link>
          <Link
            href="/about"
            className={`transition-colors hover:text-primary ${
              isActive('/about') ? 'text-primary font-bold' : 'text-gray-300'
            }`}
          >
            Why Vance
          </Link>
          <Link
            href="/contact"
            className={`transition-colors hover:text-primary ${
              isActive('/contact') ? 'text-primary font-bold' : 'text-gray-300'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <button
            onClick={onOpenCandidateForm}
            className="text-xs font-semibold px-3 py-2 xl:px-4 xl:py-2.5 rounded-lg border border-white/20 text-gray-200 hover:border-secondary hover:text-secondary transition-all cursor-pointer whitespace-nowrap"
          >
            Join Talent Network
          </button>
          <button
            onClick={onOpenClientForm}
            className="text-xs font-bold px-3 py-2 xl:px-4 xl:py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-black hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer whitespace-nowrap"
          >
            Request Talent
          </button>
        </div>

        {/* Mobile menu toggle button */}
        <div className="md:hidden shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-darkBody/95 border-b border-white/10 px-4 pt-4 pb-6 space-y-4">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-200 hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/client-solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-200 hover:text-primary"
          >
            Client Solutions
          </Link>
          <Link
            href="/candidate-hub"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-200 hover:text-secondary"
          >
            Candidate Hub
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-200 hover:text-primary"
          >
            Why Vance
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-200 hover:text-primary"
          >
            Contact
          </Link>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClientForm?.();
              }}
              className="w-full text-center text-sm font-bold py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-black cursor-pointer"
            >
              Request Talent
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCandidateForm?.();
              }}
              className="w-full text-center text-sm font-semibold py-3 rounded-lg border border-white/20 text-gray-200 cursor-pointer"
            >
              Join Talent Network
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
