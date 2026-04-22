'use client';

import { useState, useEffect } from 'react';
import { BookMarked, Trash2, MessageCircle, Phone, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import UserNav from '@/components/UserNav';

export default function CatalogPage() {
  const [catalog, setCatalog] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Load catalog
    try {
      const saved = JSON.parse(localStorage.getItem('sb_catalog') || '[]');
      setCatalog(saved);
    } catch {
      setCatalog([]);
    }

    // Load user name from cookie
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(c => c.trim().startsWith('user_session='));
    if (sessionCookie) {
      try {
        const val = decodeURIComponent(sessionCookie.split('=').slice(1).join('='));
        const session = JSON.parse(val);
        setUserName(session.name || '');
      } catch {
        setUserName('');
      }
    }
  }, []);

  const removeFromCatalog = (id) => {
    const updated = catalog.filter(p => p.id !== id);
    setCatalog(updated);
    localStorage.setItem('sb_catalog', JSON.stringify(updated));
    window.dispatchEvent(new Event('catalog_updated'));
  };

  const clearAll = () => {
    setCatalog([]);
    localStorage.setItem('sb_catalog', JSON.stringify([]));
    window.dispatchEvent(new Event('catalog_updated'));
  };

  const getWhatsAppLink = () => {
    const productList = catalog.map(p => `• ${p.name}${p.price ? ` (${p.price})` : ''}`).join('\n');
    const text = `Hi SB Construction! I am ${userName || 'a customer'} and I am interested in getting a quote for the following products:\n\n${productList}\n\nPlease send me the pricing details.`;
    return `https://wa.me/919490057579?text=${encodeURIComponent(text)}`;
  };

  return (
    <main className="main-content" style={{ minHeight: '100vh' }}>
      <UserNav />

      <section className="section-padding">
        <div className="container">
          {/* Header */}
          <div className="catalog-header">
            <div>
              <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
                <BookMarked className="text-primary" style={{ display: 'inline', marginRight: '0.5rem' }} />
                My Catalog
              </h1>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                {catalog.length > 0
                  ? `${catalog.length} product${catalog.length > 1 ? 's' : ''} saved`
                  : 'No products saved yet'}
              </p>
            </div>
            {catalog.length > 0 && (
              <div className="catalog-header-actions">
                <a href={getWhatsAppLink()} target="_blank" rel="noreferrer" className="btn-primary">
                  <MessageCircle size={16} /> Quote All on WhatsApp
                </a>
                <button onClick={clearAll} className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                  <Trash2 size={16} /> Clear All
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {catalog.length === 0 && (
            <div className="catalog-empty">
              <ShoppingBag size={64} style={{ color: 'var(--border-color)', marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#2D1C16' }}>Your catalog is empty</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
                Browse our products and click <strong>&quot;Save&quot;</strong> on any product to add it to your personal catalog.
              </p>
              <Link href="/home#products" className="btn-primary">
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Catalog Grid */}
          {catalog.length > 0 && (
            <div className="catalog-grid">
              {catalog.map(product => (
                <div key={product.id} className="catalog-card">
                  <div style={{ overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
                    <Image
                      src={product.img_path || '/sand-coarse.png'}
                      alt={product.name}
                      width={400} height={180}
                      style={{ objectFit: 'cover', width: '100%', height: '180px', display: 'block' }}
                      unoptimized
                    />
                  </div>
                  <div className="catalog-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#2D1C16', flex: 1 }}>{product.name}</h3>
                      {product.price && (
                        <span style={{ background: '#D0EDDA', color: '#1a1a1a', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          {product.price}
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.desc}</p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <a
                        href={`https://wa.me/919490057579?text=${encodeURIComponent(`Hi SB Construction! I want a quote for: ${product.name}${product.price ? ` (${product.price})` : ''}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem 1rem', background: '#25D366', borderColor: '#1e9e4f', boxShadow: '0 4px 0 #1e9e4f' }}
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                      <button
                        onClick={() => removeFromCatalog(product.id)}
                        className="btn-secondary catalog-remove-btn"
                        title="Remove from catalog"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Actions */}
      <div className="floating-actions">
        <a href="https://wa.me/919490057579" target="_blank" rel="noreferrer" className="fab fab-whatsapp">
          <MessageCircle />
        </a>
        <a href="tel:+919490057579" className="fab fab-call">
          <Phone />
        </a>
      </div>
    </main>
  );
}
