'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HardHat, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserLogin() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), mobile: mobile.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/home');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="user-login-main">
      <div className="user-login-bg" aria-hidden="true" />

      <div className="user-login-card">
        {/* Back link */}
        <Link href="/" className="user-login-back">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <div className="user-login-header">
          <div className="user-login-icon">
            <Image src="/logo.png" alt="SB Construction" width={72} height={72} style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%' }} priority />
          </div>
          <h1 className="user-login-title">Welcome to SB Construction</h1>
          <p className="user-login-subtitle">
            Enter your details to explore our full product range &amp; pricing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="lead-form user-login-form">
          <div className="form-group">
            <label htmlFor="user-name">Your Name</label>
            <input
              id="user-name"
              type="text"
              placeholder="e.g. Ravi Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="user-mobile">Mobile Number</label>
            <div className="user-login-mobile-wrap">
              <span className="user-login-prefix"><Phone size={14} /> +91</span>
              <input
                id="user-mobile"
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-primary w-full user-login-btn" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" opacity="0.8" />
                </svg>
                Entering Site...
              </span>
            ) : (
              <>Explore Products <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="user-login-privacy">
          🔒 Your details are secure and used only for quote &amp; service purposes.
        </p>
      </div>
    </main>
  );
}
