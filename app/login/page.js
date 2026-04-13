'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('LOGIN'); // LOGIN, RESET_OTP, RESET_CONFIRM
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const requestReset = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/auth/reset/send-otp', { method: 'POST' });
      if (res.ok) {
        setMode('RESET_CONFIRM');
        setSuccessMsg('Security OTP sent to master admin email.');
      } else {
        setError('Failed to dispatch security code.');
      }
    } catch (err) {
      setError('Network failure.');
    } finally {
      setLoading(false);
    }
  };

  const confirmReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, newPassword })
      });

      if (res.ok) {
        setMode('LOGIN');
        setPassword('');
        setSuccessMsg('Master Password updated successfully. Please login.');
      } else {
        const data = await res.json();
        setError(data.error || 'Verification failed.');
      }
    } catch (err) {
      setError('Network failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, rgba(232, 216, 195, 0.8) 0%, rgba(206, 186, 160, 0.9) 100%), url("https://images.unsplash.com/photo-1541888086925-0c13bb135fdf?auto=format&fit=crop&q=80") center/cover fixed' }}>
      
      <div className="modal-content about-card" style={{ animation: 'zoomIn 0.3s ease', position: 'relative', zIndex: 10, maxWidth: '400px' }}>
        
        {mode === 'LOGIN' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <ShieldCheck size={50} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
              <h2 className="modal-title" style={{ fontSize: '1.8rem', textShadow: 'none' }}>Control Center</h2>
              <p className="modal-subtitle">Secure High-End Admin Access</p>
            </div>
            
            {successMsg && <div className="success-msg mb-4" style={{ padding: '1rem' }}><p style={{ margin: 0 }}>{successMsg}</p></div>}
            
            <form onSubmit={handleLogin} className="lead-form">
              <div className="form-group">
                <label>Master Vault Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  style={{ background: 'rgba(255,255,255,0.8)' }}
                />
              </div>
              {error && <p className="error-msg">{error}</p>}
              <button type="submit" className="btn-primary w-full" disabled={loading} style={{ padding: '1rem' }}>
                {loading ? 'Authenticating Tunnel...' : 'Unlock Systems'}
              </button>
            </form>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button 
                onClick={() => setMode('RESET_OTP')} 
                style={{ background: 'transparent', border: 'none', color: '#5D4037', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}
              >
                Suspect Unauthorized Access? Reset Master Key
              </button>
            </div>
          </>
        )}

        {mode === 'RESET_OTP' && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setMode('LOGIN')} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'transparent', border: 'none', color: '#2D1C16', cursor: 'pointer' }}><ArrowLeft /></button>
            <Mail size={50} style={{ color: 'var(--warning)', margin: '0 auto 1rem auto' }} />
            <h2 className="modal-title" style={{ fontSize: '1.5rem', textShadow: 'none' }}>Emergency Overwrite</h2>
            <p className="modal-subtitle" style={{ fontSize: '0.9rem' }}>We will dispatch a 6-digit cryptographic OTP to your master email inbox.</p>
            
            {error && <p className="error-msg">{error}</p>}
            
            <button onClick={requestReset} className="btn-primary w-full" disabled={loading} style={{ background: 'var(--warning)', marginTop: '1rem', borderColor: '#e65100', boxShadow: '0 5px 0 #e65100' }}>
              {loading ? 'Dispatching...' : 'Dispatch Security Code'}
            </button>
          </div>
        )}

        {mode === 'RESET_CONFIRM' && (
          <>
            <button onClick={() => setMode('LOGIN')} style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'transparent', border: 'none', color: '#2D1C16', cursor: 'pointer' }}><ArrowLeft /></button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <Lock size={40} style={{ color: 'var(--success)', margin: '0 auto 1rem auto' }} />
              <h2 className="modal-title" style={{ fontSize: '1.4rem', textShadow: 'none' }}>Verify Identity</h2>
            </div>
            
            {successMsg && <p style={{ color: 'var(--success)', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>{successMsg}</p>}
            
            <form onSubmit={confirmReset} className="lead-form">
              <div className="form-group">
                <label>6-Digit Email OTP</label>
                <input 
                  type="text" 
                  placeholder="------" 
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  style={{ background: 'rgba(255,255,255,0.8)', textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </div>
              <div className="form-group">
                <label>New Master Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new lock key" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  style={{ background: 'rgba(255,255,255,0.8)' }}
                />
              </div>
              
              {error && <p className="error-msg">{error}</p>}
              
              <button type="submit" className="btn-primary w-full" disabled={loading} style={{ background: 'var(--success)', borderColor: '#1b5e20', boxShadow: '0 5px 0 #1b5e20' }}>
                {loading ? 'Verifying...' : 'Set New Lock & Seal'}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
