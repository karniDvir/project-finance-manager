'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, redirect to sign in
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      // If authenticated, redirect to projects page
      router.push('/projects');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!session) {
    return null;
  }

  // If authenticated, show the main dashboard
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Project Finance Manager</h1>
      <p>Welcome! Use the button below to manage beneficiaries.</p>

      <Link
        href="/beneficiaries"
        style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
        }}
      >
        Go to Beneficiaries
      </Link>
    </main>
  );
}
