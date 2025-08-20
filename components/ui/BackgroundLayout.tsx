"use client";

interface BackgroundLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function BackgroundLayout({ children, className = "" }: BackgroundLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden ${className}`}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-none rotate-45"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-none rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-none rotate-12"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
