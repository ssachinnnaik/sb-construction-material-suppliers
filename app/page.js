'use client';

import { Phone, MessageCircle, Truck, ShieldCheck, Star, ArrowRight, HardHat, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const faqs = [
  {
    q: 'Where can I buy bricks at the lowest price in Hyderabad?',
    a: 'SB Construction offers Karimnagar red bricks at the lowest price in Hyderabad with direct lorry supply and zero middlemen. We pass all savings directly to you. Call +91 9490 057 579 for today\'s rate.',
  },
  {
    q: 'What is the best bricks supplier in Hyderabad?',
    a: 'SB Construction is Hyderabad\'s most trusted bricks and sand supplier with 15+ years of experience, 100% honest counting system, and direct delivery across all areas of Hyderabad and Telangana.',
  },
  {
    q: 'Where to buy sand and bricks for very less price in Hyderabad?',
    a: 'At SB Construction you can buy both sand and bricks for very less price in Hyderabad. We supply river sand, M-sand, coarse sand, and Karimnagar red bricks directly at wholesale prices — no brokers, no hidden charges.',
  },
  {
    q: 'Do you deliver construction materials to my site in Hyderabad?',
    a: 'Yes! SB Construction delivers bricks, sand and all construction materials directly to your construction site in Hyderabad using our own lorry fleet. Same-day and next-day delivery available.',
  },
  {
    q: 'What is the price of Karimnagar bricks in Hyderabad?',
    a: 'Karimnagar red brick prices vary by quantity and location. SB Construction offers transparent, no-surprise pricing. Contact us at +91 9490 057 579 to get the current price per 1000 bricks delivered to your site.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item" onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="landing-main">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-bg" aria-hidden="true" />
        <div className="container landing-hero-content">
          <div className="landing-badge">
            <HardHat size={16} />
            <span>Trusted Since 2010 · Hyderabad</span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <Image src="/logo.png" alt="SB Construction Logo" width={250} height={250} style={{ objectFit: 'contain' }} priority />
          </div>
          <p className="landing-tagline">
            Best Bricks &amp; Sand Supplier in Hyderabad — Lowest Price, Direct Delivery
          </p>
          <p className="landing-desc">
            Buy Karimnagar red bricks, river sand, M-sand &amp; coarse sand at the lowest price in Hyderabad.
            Direct lorry supply · Zero middlemen · 100% transparent pricing.
          </p>
          <div className="landing-cta-group">
            <Link href="/user-login" className="btn-primary landing-cta-btn">
              View Products &amp; Prices <ArrowRight size={18} />
            </Link>
            <a href="tel:+919490057579" className="btn-secondary landing-cta-btn">
              <Phone size={16} /> Call Now
            </a>
          </div>
          <div className="landing-hero-meta">
            <span><MapPin size={14} /> Serving all of Hyderabad &amp; Telangana</span>
            <span><Clock size={14} /> Mon–Sat 7AM–8PM</span>
          </div>
        </div>
      </section>

      {/* Products Overview — keyword-rich visible content for Google */}
      <section className="landing-products section-padding" id="products">
        <div className="container">
          <h2 className="section-title">Construction Materials at Lowest Price in Hyderabad</h2>
          <p className="landing-products-intro">
            Looking for <strong>affordable bricks and sand in Hyderabad</strong>? SB Construction supplies
            premium quality construction materials directly from the source — no middlemen, no inflated rates.
            We are the <strong>best bricks supplier in Hyderabad</strong> trusted by 500+ builders and homeowners.
          </p>
          <div className="landing-product-grid">
            {[
              {
                name: 'Karimnagar Red Bricks',
                desc: 'Best quality Karimnagar red bricks at the lowest price in Hyderabad. Ideal for residential and commercial construction. Uniform size, high strength, direct lorry delivery.',
                tag: 'Most Popular',
                icon: '🧱',
              },
              {
                name: 'River Sand',
                desc: 'Premium river sand for plastering, masonry and concrete. Buy river sand in Hyderabad at affordable rates. Sourced from top quarries across Telangana.',
                tag: 'Best for Plastering',
                icon: '🏖️',
              },
              {
                name: 'M-Sand (Manufactured Sand)',
                desc: 'High-grade M-sand at the best price in Hyderabad. Perfect substitute for river sand in RCC work. Consistent quality, dust-free, environment-friendly.',
                tag: 'Eco-Friendly',
                icon: '⚙️',
              },
              {
                name: 'Coarse Sand',
                desc: 'Coarse sand for foundation work and concrete mixing at very less price. Bulk supply available for large construction projects across Hyderabad.',
                tag: 'Bulk Available',
                icon: '🪨',
              },
            ].map(p => (
              <div key={p.name} className="landing-product-card">
                <div className="landing-product-icon">{p.icon}</div>
                <div className="landing-product-tag">{p.tag}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <Link href="/user-login" className="landing-product-cta">
                  Get Price <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="landing-values">
        <div className="container">
          <h2 className="section-title">Why Builders Choose SB Construction</h2>
          <div className="landing-value-grid">
            <div className="landing-value-card">
              <div className="landing-value-icon"><Truck size={32} /></div>
              <h3>Own Lorry Fleet</h3>
              <p>No broker delays. We own our vehicles — guaranteed on-time delivery of bricks and sand to your construction site in Hyderabad.</p>
            </div>
            <div className="landing-value-card">
              <div className="landing-value-icon"><ShieldCheck size={32} /></div>
              <h3>100% Honest Counting</h3>
              <p>Manual verification on every delivery. Every brick counted in front of you — we never short-supply. No distraction tricks.</p>
            </div>
            <div className="landing-value-card">
              <div className="landing-value-icon"><Star size={32} /></div>
              <h3>Lowest Price Guaranteed</h3>
              <p>Buy Karimnagar red bricks &amp; river sand for very less price in Hyderabad. Zero middlemen means you always get the best rate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="landing-stats">
        <div className="container landing-stats-grid">
          <div className="landing-stat">
            <span className="landing-stat-num">500+</span>
            <span className="landing-stat-label">Projects Delivered</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-num">15+</span>
            <span className="landing-stat-label">Years in Hyderabad</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-num">100%</span>
            <span className="landing-stat-label">Transparent Pricing</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat-num">4.8★</span>
            <span className="landing-stat-label">Customer Rating</span>
          </div>
        </div>
      </section>

      {/* FAQ Section — directly answers search queries Google sees */}
      <section className="landing-faq section-padding">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem', fontWeight: 500 }}>
            Common questions about buying bricks and sand in Hyderabad at the best price
          </p>
          <div className="faq-list">
            {faqs.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-bottom-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
            Get the Best Price on Bricks &amp; Sand in Hyderabad
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem', fontWeight: 500 }}>
            Login to view our complete product catalog with live prices &amp; cost estimator.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/user-login" className="btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
              View Full Price List <ArrowRight size={18} />
            </Link>
            <a href="tel:+919490057579" className="btn-secondary" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>
              <Phone size={16} /> +91 9490 057 579
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer section-padding">
        <div className="container text-center">
          <p style={{ marginBottom: '0.5rem', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--primary)' }}>SB Construction Materials Suppliers</strong> — Hyderabad&apos;s trusted bricks &amp; sand supplier since 2010.<br />
            Serving Hyderabad, Secunderabad, Warangal &amp; all of Telangana.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
            📧 <a href="mailto:sbmcontsct5886@gmail.com" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>sbmcontsct5886@gmail.com</a>
            &nbsp;|&nbsp;
            📞 <a href="tel:+919490057579" style={{ textDecoration: 'underline', color: 'var(--primary)' }}>+91 9490 057 579</a>
          </p>
          <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#555' }}>
            &copy; {new Date().getFullYear()} SB Construction Materials Suppliers. All rights reserved.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/karimnagar-red-bricks-price-hyderabad" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'underline' }}>
              Current Price of Karimnagar Bricks per 1000 in Hyderabad
            </Link>
          </div>
          <p style={{ marginTop: '1rem' }}><a href="/admin" style={{ opacity: 0.4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin</a></p>
        </div>
      </footer>

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
