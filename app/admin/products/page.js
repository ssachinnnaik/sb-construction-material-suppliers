'use client';

import { useState, useEffect } from 'react';
import { PackageOpen, Trash2, Edit2, PlusCircle, ArrowLeft, X, LogOut } from 'lucide-react';
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
  
  const [isEditing, setIsEditing] = useState(false);
  const [submitState, setSubmitState] = useState({ loading: false, error: '', success: '' });

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    window.location.href = '/login';
  };

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

    if (!formData.id || !formData.name || !formData.desc) {
      setSubmitState({ loading: false, error: 'Please fill all required fields.', success: '' });
      return;
    }
    
    // Require image only if creating a new product
    if (!isEditing && !formData.image) {
      setSubmitState({ loading: false, error: 'Product image is required for new products.', success: '' });
      return;
    }

    const payload = new FormData();
    payload.append('id', formData.id);
    payload.append('name', formData.name);
    payload.append('desc', formData.desc);
    payload.append('price', formData.price);
    payload.append('image', formData.image);

    try {
      const url = isEditing ? `/api/products/${formData.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: payload
      });

      if (res.ok) {
        setSubmitState({ loading: false, error: '', success: isEditing ? 'Product updated securely!' : 'Product added securely!' });
        setTimeout(() => { cancelEdit(); }, 2000);
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

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      desc: product.desc,
      price: product.price,
      image: null
    });
    setIsEditing(true);
    setSubmitState({ loading: false, error: '', success: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData({ id: '', name: '', desc: '', price: '', image: null });
    setIsEditing(false);
    setSubmitState({ loading: false, error: '', success: '' });
  };

  return (
    <main className="main-content" style={{ minHeight: '100vh', padding: '2rem', background: 'linear-gradient(to bottom, rgba(232, 216, 195, 0.8) 0%, rgba(206, 186, 160, 0.9) 100%), url("https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&q=80") center/cover fixed' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div>
            <Link href="/admin" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#2D1C16', fontWeight: 'bold' }}>
              <ArrowLeft size={18} /> Back to Leads
            </Link>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', textAlign: 'left', marginBottom: '0', textShadow: 'none' }}>Inventory Management</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-secondary" onClick={handleLogout}><LogOut size={16} /> Logout</button>
            <PackageOpen size={48} className="text-primary" />
          </div>
        </div>

        <div className="admin-grid">
          
          {/* Add Form */}
          <div className="about-card" style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(12px) saturate(150%)' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isEditing ? <Edit2 className="text-primary"/> : <PlusCircle className="text-primary"/>} 
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </span>
              {isEditing && (
                <button type="button" onClick={cancelEdit} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              )}
            </h3>
            <form onSubmit={handleAddProduct} className="lead-form">
              <div className="form-group">
                <label>Product ID (Unique, lowercase, no spaces)</label>
                <input type="text" placeholder="e.g. premium-cement" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toLowerCase().replace(/ /g, '-')})} style={isEditing ? { border: '1px solid var(--primary)' } : {}} />
                {isEditing && <p style={{ fontSize: '0.7rem', color: 'var(--warning)', marginTop: '0.3rem' }}>⚠️ Changing the ID will update the product's unique identifier.</p>}
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
                <label>{isEditing ? 'Upload New Image (Optional)' : 'Product Image'}</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ background: 'transparent', border: 'none', padding: '0' }} />
              </div>
              
              {submitState.error && <p className="error-msg">{submitState.error}</p>}
              {submitState.success && <p className="success-msg"><strong style={{color: 'var(--success)'}}>{submitState.success}</strong></p>}
              
              <button type="submit" className="btn-primary w-full" disabled={submitState.loading}>
                {submitState.loading ? 'Processing...' : (isEditing ? 'Save Changes' : 'Publish Product')}
              </button>
            </form>
          </div>

          {/* List Table */}
          <div className="about-card" style={{ overflowX: 'auto', textAlign: 'left', background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(12px) saturate(150%)', color: '#2D1C16' }}>
            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Live Products Catalog</h3>
            {loading ? <p>Loading inventory...</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.6)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Image</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <Image src={p.img_path} alt={p.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: '4px' }} unoptimized />
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>{p.name}</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>{p.price || 'N/A'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                          <button onClick={() => handleEdit(p)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }} title="Edit Product">
                            <Edit2 size={20} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Delete Product">
                            <Trash2 size={20} />
                          </button>
                        </div>
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
