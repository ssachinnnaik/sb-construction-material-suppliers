'use client';

import { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Circle, RefreshCw, Trash2, Globe, Package, LogOut } from 'lucide-react';

export default function AdminPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  };

  // Helper to parse fallback data if DB columns are missing
  const parseLeadData = (lead) => {
    const data = { ...lead };
    if (lead.product_interest && lead.product_interest.includes(' | Qty:')) {
      const parts = lead.product_interest.split(' | ');
      data.product_interest = parts[0];
      parts.forEach(p => {
        if (p.startsWith('Qty:')) data.required_quantity = p.replace('Qty:', '').trim();
        if (p.startsWith('Loc:')) data.delivery_location = p.replace('Loc:', '').trim();
      });
    }
    return data;
  };

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

  const changeStatus = async (lead, newStatus) => {
    try {
      const res = await fetch(`/api/leads/${lead.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
        
        // Automated WhatsApp Status Notification Generator
        if (newStatus !== 'Requested') {
          const mobile = lead.mobile_number.replace(/\D/g, ''); 
          const cleanProduct = lead.product_interest ? lead.product_interest.replace(' |', '') : 'your recent order';
          const template = `Hi ${lead.name},\n\nThis is an automated update from *SB Construction*!\n\n*Order Status changed to:* [${newStatus}]\n*Product:* ${cleanProduct}\n\nWe will keep you posted. Thanks for choosing us!`;
          const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(template)}`;
          
          if (confirm(`Status saved to database! Do you want to automatically notify the customer via WhatsApp?\n\nIt will open a chat with +91${mobile}.`)) {
            window.open(url, '_blank');
          }
        }
      }
    } catch (e) {
      console.error('Failed to change status:', e);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm('CRITICAL WARNING: Are you certain you want to permanently delete this record from the database? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
      }
    } catch (e) {
      console.error('Failed to clear lead:', e);
    }
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const header = ['ID', 'Name', 'Mobile', 'Email', 'Product', 'Quantity', 'Location', 'Upcoming Needs', 'Date', 'Status'];
    const rows = leads.map(l => {
      const parsed = parseLeadData(l);
      return [
        parsed.id, `"${parsed.name}"`, parsed.mobile_number, parsed.email, `"${parsed.product_interest}"`, `"${parsed.required_quantity || ''}"`, `"${parsed.delivery_location || ''}"`, `"${parsed.upcoming_load || ''}"`, `"${new Date(parsed.timestamp).toLocaleString()}"`, parsed.status
      ];
    });
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
    <div className="admin-container" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, rgba(232, 216, 195, 0.8) 0%, rgba(206, 186, 160, 0.9) 100%), url("https://images.unsplash.com/photo-1541888086925-0c13bb135fdf?auto=format&fit=crop&q=80") center/cover fixed' }}>
      <header className="admin-header">
        <div className="container admin-header-flex">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0' }}>Order Dashboard</h2>
          <div className="admin-actions">
            <button className="btn-secondary" onClick={() => window.location.href = '/admin/products'}><Package size={16} /> Inventory</button>
            <button className="btn-secondary" onClick={() => window.location.href = '/'}><Globe size={16} /> Live Site</button>
            <button className="btn-secondary" onClick={handleLogout}><LogOut size={16} /> Logout</button>
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
          <p style={{ textAlign: 'center', padding: '3rem', color: '#5D4037', fontWeight: 'bold' }}>Loading orders...</p>
        ) : (
          <div className="table-wrapper frosted-panel" style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(12px) saturate(150%)', borderRadius: '12px', borderTop: '5px solid var(--primary)', borderLeft: '1px solid rgba(255,255,255,0.8)', borderRight: '1px solid rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Product & Quantity</th>
                  <th>Location & Future</th>
                  <th>Date</th>
                  <th>Status & Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(rawLead => {
                  const lead = parseLeadData(rawLead);
                  return (
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
                          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary)' }}>Qty: {lead.required_quantity || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{lead.delivery_location || 'N/A'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Next: {lead.upcoming_load || 'None'}</div>
                      </td>
                      <td><div style={{ fontSize: '0.85rem' }}>{new Date(lead.timestamp).toLocaleDateString()}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(lead.timestamp).toLocaleTimeString()}</div></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <select 
                            value={lead.status || 'Requested'} 
                            onChange={(e) => changeStatus(lead, e.target.value)}
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
                        <button 
                          onClick={() => deleteLead(lead.id)} 
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.4rem', outline: 'none' }}
                          title="Permanently Delete Lead"
                        >
                          <Trash2 size={18} />
                        </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 1.5rem 0;
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .admin-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .admin-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          color: #2D1C16;
        }
        .admin-table th {
          padding: 1rem;
          background: rgba(255,255,255,0.2);
          color: #2D1C16;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 1px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.6);
        }
        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        .admin-table tr:hover {
          background: rgba(255,255,255,0.25);
        }
        .row-completed {
          opacity: 0.6;
          background: rgba(200,200,200,0.2) !important;
        }
        .badge {
          background: rgba(255, 255, 255, 0.6);
          color: var(--primary);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.85rem;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: inset 0 0 5px rgba(255,255,255,0.5);
        }
        @media (max-width: 768px) {
          .admin-header-flex { flex-direction: column; align-items: flex-start; }
          .admin-actions { flex-direction: row; }
        }
      `}</style>
    </div>
  );
}
