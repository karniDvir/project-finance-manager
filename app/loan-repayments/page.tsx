'use client';

import { useState, useEffect } from 'react';

export default function LoanRepaymentsPage() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [loanId, setLoanId] = useState('');

  const fetchRepayments = async () => {
    const res = await fetch('/api/loan-repayments');
    const data = await res.json();
    setRepayments(data);
  };

  useEffect(() => {
    fetchRepayments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/loan-repayments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), loanId }),
    });

    if (res.ok) {
      setAmount('');
      setLoanId('');
      fetchRepayments();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Loan Repayments</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#f9f9f9' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Loan ID:</label>
          <input value={loanId} onChange={(e) => setLoanId(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
        </div>
        <button type="submit" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
          Add Repayment
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>Amount</th>
            <th style={{ padding: '0.5rem' }}>Date</th>
            <th style={{ padding: '0.5rem' }}>Loan</th>
          </tr>
        </thead>
        <tbody>
          {repayments.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{r.amount}</td>
              <td style={{ padding: '0.5rem' }}>{new Date(r.date).toLocaleDateString()}</td>
              <td style={{ padding: '0.5rem' }}>{r.loanId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
