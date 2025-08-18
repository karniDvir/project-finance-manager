'use client';

import { useState, useEffect } from 'react';

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const fetchLoans = async () => {
    const res = await fetch('/api/loans');
    const data = await res.json();
    setLoans(data);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount: Number(amount) }),
    });

    if (res.ok) {
      setName('');
      setAmount('');
      fetchLoans();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Loans</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#f9f9f9' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
          Add Loan
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>Name</th>
            <th style={{ padding: '0.5rem' }}>Amount</th>
            <th style={{ padding: '0.5rem' }}>Returned</th>
            <th style={{ padding: '0.5rem' }}>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((l) => (
            <tr key={l.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{l.name}</td>
              <td style={{ padding: '0.5rem' }}>{l.amount}</td>
              <td style={{ padding: '0.5rem' }}>{l.amountReturned}</td>
              <td style={{ padding: '0.5rem' }}>{l.amountRemain}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
