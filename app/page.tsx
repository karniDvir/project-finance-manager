'use client';

import Link from 'next/link';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import { use } from 'react';

export default function HomePage() {
  const {data : session} = useSession();
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
