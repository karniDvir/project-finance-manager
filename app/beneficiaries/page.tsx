'use client';

import { useState, useEffect } from 'react';

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  // Fetch beneficiaries
  const fetchBeneficiaries = async () => {
    const res = await fetch(`/api/beneficiaries?sortBy=${sortBy}&sort=${sort}`);
    const data = await res.json();
    setBeneficiaries(data);
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, [sortBy, sort]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/beneficiaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        reason,
        totalAmount: totalAmount || undefined,
      }),
    });

    if (res.ok) {
      setName('');
      setReason('');
      setTotalAmount('');
      fetchBeneficiaries(); // refresh list
    } else {
      const err = await res.json();
      alert(err.message || 'Error creating beneficiary');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Beneficiaries</h1>

      {/* Add Beneficiary Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          maxWidth: '400px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Name:
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Reason:
          </label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Total Amount:
          </label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#0070f3',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Beneficiary
        </button>
      </form>

      {/* Sorting Controls */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Sort By: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Created At</option>
          <option value="totalAmount">Total Amount</option>
          <option value="amountPaid">Amount Paid</option>
          <option value="amountRemain">Amount Remain</option>
        </select>

        <button
          onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
          style={{
            marginLeft: '1rem',
            padding: '0.3rem 0.8rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {sort === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {/* List Beneficiaries */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Reason</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Total</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Paid</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Remaining</th>
          </tr>
        </thead>
        <tbody>
          {beneficiaries.map((b) => (
            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem' }}>{b.name}</td>
              <td style={{ padding: '0.5rem' }}>{b.reason}</td>
              <td style={{ padding: '0.5rem' }}>{b.totalAmount ?? 0}</td>
              <td style={{ padding: '0.5rem' }}>{b.amountPaid ?? 0}</td>
              <td style={{ padding: '0.5rem' }}>{b.amountRemain ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
