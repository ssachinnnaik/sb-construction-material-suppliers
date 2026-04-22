'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function BricksPricePage() {
  return (
    <main className="landing-main" style={{ background: '#0A0A0A', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #2E2E2E', padding: '1.5rem 0', background: '#111' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="user-login-back" style={{ marginBottom: 0 }}>
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>
            SB Construction Stats
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="container" style={{ maxWidth: '800px', marginTop: '4rem' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div className="landing-badge" style={{ marginBottom: '1rem' }}>
            <TrendingUp size={16} /> Market Data 2026
          </div>
          <h1 className="landing-title" style={{ fontSize: '2.8rem', lineHeight: '1.2' }}>
            What is the price of Karimnagar Red Bricks per 1000 in Hyderabad? (2026 Data)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1.5rem' }}>
            Direct data sourced from over 500+ lorry deliveries across Telangana, showing exact market rates vs direct wholesale rates.
          </p>
        </div>

        {/* Front-loaded Value (Video Strategy: Give the answer immediately) */}
        <div style={{ background: '#1A1A1A', border: '2px solid var(--primary)', borderRadius: '12px', padding: '2.5rem', marginBottom: '3rem', boxShadow: '0 10px 30px rgba(245,196,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 color="var(--primary)" /> The Short Answer
          </h2>
          <p style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
            As of <strong>2026</strong>, the retail market price of <strong>Karimnagar Red Bricks inside Hyderabad</strong> ranges from <strong>₹7,500 to ₹9,000 per 1000 bricks</strong> when bought through retail brokers.<br/><br/>
            However, when buying <strong>directly via Lorry Supply</strong> (zero middlemen), the price drops significantly to exactly <strong>wholesale quarry rates</strong> plus transport.
          </p>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #333' }}>
            <Link href="/user-login" className="btn-primary" style={{ display: 'inline-block' }}>
              Check Today's Live Wholesale Price →
            </Link>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#D0D0D0' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '2.5rem 0 1.5rem' }}>
            Why do prices vary so much?
          </h2>
          <p>
            When searching for "<strong>bricks for low price in Hyderabad</strong>", many buyers get confused by the wildly varying quotes. The price difference entirely comes down to the supply chain.
          </p>
          
          <ul style={{ margin: '1.5rem 0 2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><strong>The Broker Markup:</strong> Standard retail brokers add a ₹1 to ₹2 margin per brick. For a 10,000 brick load, that's an unnecessary ₹10,000 to ₹20,000 premium.</li>
            <li><strong>Transport Distances:</strong> True Karimnagar red bricks travel over 160km to reach Hyderabad. Wholesale direct-lorry suppliers consolidate this cost.</li>
            <li><strong>"Short Counting" Fraud:</strong> The biggest hidden cost! Many suppliers quote a lower initial price, but deliver 10-15% fewer bricks. If you pay for 5,000 bricks but receive 4,500, your <em>actual price per brick</em> is much higher.</li>
          </ul>

          <h2 style={{ fontSize: '2rem', color: 'var(--text-main)', margin: '2.5rem 0 1.5rem' }}>
            The SB Construction Difference
          </h2>
          <p>
            We operate under a simple principle: <strong>Direct Lorry Supply.</strong> By bypassing the retail yards entirely, we bring the best quality Karimnagar red bricks straight from the kiln to your construction site in Hyderabad. 
            Coupled with our strict <strong>100% manual loading and counting policy</strong>, you get exactly what you pay for—making our effective rate the <strong>lowest price in Hyderabad</strong>.
          </p>

          {/* CTA Box */}
          <div style={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: '12px', padding: '2rem', marginTop: '3rem', textAlign: 'center' }}>
            <HelpCircle size={40} color="var(--brick)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Get A Direct Quote For Your Site</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              We supply River Sand, M-Sand, Coarse Sand, and Bricks directly. 
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/user-login" className="btn-primary">View Catalog</Link>
              <a href="tel:+919490057579" className="btn-outline-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.8rem 1.5rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 700 }}>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
