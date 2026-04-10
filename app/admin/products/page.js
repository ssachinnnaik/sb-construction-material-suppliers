'use client';

import { useState, useEffect } from 'react';
import { PackageOpen, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    desc: '',
    price: '',
    image: null
  });
  
  const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, error: '', success: '' });

    if (!formData.id || !formData.name || !formData.desc || !formData.image) {
      setSubmitState({ loading: false, error: 'Please fill all required fields.', success: '' });
      return;
    }

    const payload = new FormData();
    payload.append('id', formData.id);
    payload.append('name', formData.name);
    payload.append('desc', formData.desc);
    payload.append('price', formData.price);
    payload.append('image', formData.image);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: payload
      });

      if (res.ok) {
        setSubmitState({ loading: false, error: '', success: 'Product added securely!' });
        setFormData({ id: '', name: '', desc: '', price: '', image: null });
        fetchProducts(); // refresh table
      } else {
        const data = await res.json();
        setSubmitState({ loading: false, error: data.error || 'Upload failed.', success: '' });
      }
    } catch (err) {
      setSubmitState({ loading: false, error: 'Connection failed.', success: '' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete ${id}?`)) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="main-content" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <Link href="/admin" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <ArrowLeft size={18} /> Back to Leads
            </Link>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '0' }}>Inventory Management</h1>
          </div>
          <PackageOpen size={48} className="text-primary" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Add Form */}
          <div className="about-card" style={{ textAlign: 'left' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle className="text-primary"/> Add New Product
            </h3>
            <form onSubmit={handleAddProduct} className="lead-form">
              <div className="form-group">
                <label>Product ID (Lowercase, no spaces)</label>
                <input type="text" placeholder="e.g. premium-cement" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/ /g, '-')})} />
              </div>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" placeholder="e.g. Premium Cement 50kg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="text" placeholder="e.g. ₹350 / Bag" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Description Details</label>
                <input type="text" placeholder="Strong setting cement for core structure." value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ background: 'transparent', border: 'none', padding: '0' }} />
              </div>
              
              {submitState.error && <p className="error-msg">{submitState.error}</p>}
              {submitState.success && <p className="success-msg"><strong style={{color: 'var(--success)'}}>{submitState.success}</strong></p>}
              
              <button type="submit" className="btn-primary w-full" disabled={submitState.loading}>
                {submitState.loading ? 'Uploading...' : 'Publish Product'}
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="about-card" style={{ overflowX: 'auto', textAlign: 'left' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Live Products Catalog</h3>
            {loading ? <p>Loading inventory...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Image</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <Image src={p.img_path} alt={p.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: '4px' }} unoptimized />
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{p.name}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>{p.price || 'N/A'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No products published yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
