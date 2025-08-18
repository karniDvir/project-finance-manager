'use client';

import { useState, useEffect } from 'react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [paymentTypeId, setPaymentTypeId] = useState('');

  // Fetch payments
  const fetchPayments = async () => {
    const res = await fetch('/api/payments');
    const data = await res.json();
    setPayments(data);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), beneficiaryId, paymentTypeId }),
    });

    if (res.ok) {
      setAmount('');
      setBeneficiaryId('');
      setPaymentTypeId('');
      fetchPayments();
    } else {
      const err = await res.json();
      alert(err.message || 'Error creating payment');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Payments</h1>

      {/* Add Payment Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#f9f9f9' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Beneficiary ID:</label>
          <input
            value={beneficiaryId}
            onChange={(e) => setBeneficiaryId(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Payment Type ID:</label>
          <input
            value={paymentTypeId}
            onChange={(e) => setPaymentTypeId(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" style={{ backgroundColor: '#0070f3', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
          Add Payment
        </button>
      </form>

      {/* List Payments */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '0.5rem' }}>Amount</th>
            <th style={{ padding: '0.5rem' }}>Date</th>
            <th style={{ padding: '0.5rem' }}>Beneficiary</th>
            <th style={{ padding: '0.5rem' }}>Payment Type</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{p.amount}</td>
              <td style={{ padding: '0.5rem' }}>{new Date(p.date).toLocaleDateString()}</td>
              <td style={{ padding: '0.5rem' }}>{p.beneficiaryId}</td>
              <td style={{ padding: '0.5rem' }}>{p.paymentTypeId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
