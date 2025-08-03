import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-gradient-to-br from-slate-50 to-purple-50/30 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-xl exercise-gradient flex items-center justify-center shadow-glow group-hover:shadow-glow-hover transition-all duration-300">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Integral</span>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Turn handwritten math into shareable exercises. Submit, solve, and
              learn together with our AI-powered platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/exercises"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  Browse Exercises
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  Submit Exercise
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 hover:text-purple-600 transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 mt-12 pt-8 text-center">
          <p className="text-slate-600 text-sm">
            © 2025 Integral. All rights reserved. Made with{" "}
            <span className="text-purple-600 animate-pulse">❤️</span> for math
            education.
          </p>
        </div>
      </div>
    </footer>
  );
}
