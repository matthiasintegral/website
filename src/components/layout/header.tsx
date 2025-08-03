"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PenTool, Search, Home, Sparkles, Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-b glassmorphism sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 rounded-xl exercise-gradient flex items-center justify-center shadow-glow group-hover:shadow-glow-hover transition-all duration-300">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Integral</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1 hover:scale-105 transform duration-200"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/exercises"
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center space-x-1 hover:scale-105 transform duration-200"
            >
              <Search className="h-4 w-4" />
              <span>Browse Exercises</span>
            </Link>
          </nav>

          {/* Desktop CTA + Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* Desktop CTA Button */}
            <Button
              asChild
              className="hidden sm:flex exercise-gradient text-white border-0 hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/submit">
                <PenTool className="h-4 w-4 mr-2" />
                Submit Exercise
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg">
            <nav className="px-4 py-4 space-y-3">
              <Link
                href="/"
                className="flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/exercises"
                className="flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                <span>Browse Exercises</span>
              </Link>
              <div className="pt-2">
                <Button
                  asChild
                  className="w-full exercise-gradient text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/submit">
                    <PenTool className="h-4 w-4 mr-2" />
                    Submit Exercise
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
