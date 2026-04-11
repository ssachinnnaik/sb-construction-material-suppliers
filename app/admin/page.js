'use client';

import { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Circle, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (e) {
      console.error('Failed to change status:', e);
    }
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const header = ['ID', 'Name', 'Mobile', 'Email', 'Product', 'Quantity', 'Location', 'Upcoming Needs', 'Date', 'Status'];
    const rows = leads.map(l => [
      l.id, `"${l.name}"`, l.mobile_number, l.email, `"${l.product_interest}"`, `"${l.required_quantity}"`, `"${l.delivery_location}"`, `"${l.upcoming_load}"`, `"${new Date(l.timestamp).toLocaleString()}"`, l.status
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.mobile_number.includes(search) ||
    (l.email && l.email.includes(search))
  );

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="container admin-header-flex">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0' }}>Order Dashboard</h2>
          <div className="admin-actions">
            <button className="btn-secondary" onClick={fetchLeads}><RefreshCw size={16} /> Refresh</button>
            <button className="btn-primary" onClick={exportCSV}><Download size={16} /> Export CSV</button>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '2rem 1.5rem' }}>
        <div className="search-bar" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
          <Search className="text-muted" style={{ minWidth: '24px' }} />
          <input 
            type="text" 
            placeholder="Search by name, email, or mobile..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '1.1rem' }}
          />
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Loading orders...</p>
        ) : (
          <div className="table-wrapper" style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Product & Quantity</th>
                  <th>Location & Future</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className={lead.status === 'Completed' ? 'row-completed' : ''}>
                    <td>#{lead.id}</td>
                    <td style={{ fontWeight: '600' }}>{lead.name}</td>
                    <td>
                      <div>{lead.mobile_number}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lead.email}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span className="badge">{lead.product_interest}</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>Qty: {lead.required_quantity}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{lead.delivery_location}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Next: {lead.upcoming_load}</div>
                    </td>
                    <td><div style={{ fontSize: '0.85rem' }}>{new Date(lead.timestamp).toLocaleDateString()}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(lead.timestamp).toLocaleTimeString()}</div></td>
                    <td>
                      <select 
                        value={lead.status || 'Requested'} 
                        onChange={(e) => changeStatus(lead.id, e.target.value)}
                        style={{
                          background: 'rgba(61, 82, 160, 0.4)',
                          color: '#EDE8F5',
                          border: '1px solid var(--border-color)',
                          padding: '0.4rem',
                          borderRadius: '4px',
                          outline: 'none'
                        }}
                      >
                        <option value="Requested">Requested</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-header {
          background: var(--bg-card);
          padding: 1.5rem 0;
          border-bottom: 2px solid var(--primary);
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          color: var(--primary);
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }
        .admin-table td {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .admin-table tr:hover {
          background: rgba(255,255,255,0.02);
        }
        .row-completed {
          opacity: 0.5;
        }
        .badge {
          background: rgba(250, 204, 21, 0.1);
          color: var(--primary);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
}
