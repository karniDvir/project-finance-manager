"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  if (!session) return null;

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Finance Manager</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/projects" 
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Projects
            </Link>
            <Link 
              href="/beneficiaries" 
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Beneficiaries
            </Link>
            <Link 
              href="/payments" 
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Payments
            </Link>
            <Link 
              href="/loans" 
              className="text-slate-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Loans
            </Link>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-2 hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-white text-sm font-medium">{session.user?.name}</div>
                <div className="text-slate-400 text-xs">{session.user?.email}</div>
              </div>
              <svg 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <div className="py-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Account Settings
                  </Link>
                  <div className="border-t border-white/10 my-2"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsProfileMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
}
