'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, AlertTriangle, ShieldCheck, Truck, ChevronRight, X, Mail, MapPin, Package } from 'lucide-react';
import Image from 'next/image';
import ParticleBg from '@/components/ParticleBg';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalStage, setModalStage] = useState('CONTACT'); // CONTACT, OTP, DETAILS
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' });
  const [orderDetails, setOrderDetails] = useState({ quantity: '', location: '', upcoming: '' });
  
  const [emailOtp, setEmailOtp] = useState('');
  const [sandboxOtp, setSandboxOtp] = useState(null);
  const [submitState, setSubmitState] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(data => setProducts(data.products || [])).catch(console.error);
  }, []);

  const openModal = (productName) => {
    setSelectedProduct(productName);
    setModalOpen(true);
    setModalStage('CONTACT');
    setEmailOtp('');
    setSandboxOtp(null);
    setOrderDetails({ quantity: '', location: '', upcoming: '' });
    setSubmitState({ loading: false, success: false, error: '' });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false, error: '' });

    if (!formData.name.trim() || !formData.mobile.trim() || !formData.email.trim()) {
      return setSubmitState({ loading: false, success: false, error: 'Name, Mobile, and Email are required.' });
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      return setSubmitState({ loading: false, success: false, error: 'Mobile number must be exactly 10 digits.' });
    }

    try {
      const emailRes = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const emailData = await emailRes.json();
      
      if (!emailRes.ok) {
        throw new Error(emailData.error || 'Failed to send OTP');
      }

      if (emailData.sandbox_otp) {
        setSandboxOtp(emailData.sandbox_otp);
      }

      setModalStage('OTP');
      setSubmitState({ loading: false, success: false, error: '' });
      
    } catch (err) {
      console.error(err);
      setSubmitState({ loading: false, success: false, error: err.message || 'Error communicating with server.' });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false, error: '' });

    const codeToVerify = emailOtp || '';

    try {
      const verifyRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp_code: codeToVerify })
      });
      
      if (!verifyRes.ok) {
        const vData = await verifyRes.json();
        throw new Error(vData.error || 'Invalid OTP');
      }

      setModalStage('DETAILS');
      setSubmitState({ loading: false, success: false, error: '' });
    } catch (err) {
      console.error(err);
      setSubmitState({ loading: false, success: false, error: err.message || 'Verification failed.' });
    }
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false, error: '' });

    try {
      const leadRes = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          mobile_number: formData.mobile, 
          email: formData.email,
          product_interest: selectedProduct || 'General Inquiry',
          required_quantity: orderDetails.quantity,
          delivery_location: orderDetails.location,
          upcoming_load: orderDetails.upcoming
        })
      });

      if (leadRes.ok) {
        setSubmitState({ loading: false, success: true, error: '' });
        setFormData({ name: '', mobile: '', email: '' });
        setOrderDetails({ quantity: '', location: '', upcoming: '' });
        setTimeout(() => closeModal(), 3000);
      } else {
        const lData = await leadRes.json();
        throw new Error(lData.error || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setSubmitState({ loading: false, success: false, error: err.message || 'Submission failed.' });
    }
  };

  return (
    <main className="main-content">
      {/* Hero Section */}
      <section className="hero">
        <ParticleBg />
        <div className="container hero-content text-center">
          <h1 className="hero-title animate-fade-in">
            SB Construction <br/>
            <span className="text-primary italic">Material Suppliers</span>
          </h1>
          <p className="hero-tagline">Hyderabad's Most Trusted Direct Source</p>
          <p className="hero-desc">
            We source directly from premium quarries and factories using our own fleet. 
            Zero middlemen. 100% transparency. Uncompromised honesty for your build.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              View Catalog
            </button>
            <button className="btn-secondary" onClick={() => openModal('Instant Quote')}>
              Instant Quote
            </button>
          </div>
        </div>
      </section>

      {/* Trust Blocks */}
      <section className="section-padding">
        <div className="container">
          <div className="about-grid">
            <div className="glass-card text-center">
              <div className="mb-4 inline-block p-4 rounded-2xl bg-primary/10">
                <Truck size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Fleet</h3>
              <p className="text-muted">No external transporters. Our own lorries ensure on-time delivery without hidden costs.</p>
            </div>
            <div className="glass-card text-center">
              <div className="mb-4 inline-block p-4 rounded-2xl bg-success/10">
                <ShieldCheck size={32} className="text-success" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Quality</h3>
              <p className="text-muted">Every brick and load of sand is manually inspected before it leaves our source sites.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness Redux */}
      <section className="section-padding">
        <div className="container">
          <div className="awareness-banner text-center">
            <AlertTriangle size={64} className="text-danger mb-6 bounce-anim mx-auto" />
            <h2 className="section-title mb-2">Market Alert</h2>
            <p className="text-muted mb-12">Don't be a victim of construction material scams in Hyderabad.</p>
            
            <div className="warning-grid">
              <div className="warning-card">
                <h4 className="font-bold text-lg mb-2 text-danger">The "Short Load" Trick</h4>
                <p className="text-muted text-sm">Suppliers often skip layers of bricks or underfill sand volumes to compensate for fake low prices.</p>
              </div>
              <div className="warning-card">
                <h4 className="font-bold text-lg mb-2 text-danger">Distraction Unloading</h4>
                <p className="text-muted text-sm">Agents distract you during count to hide product shortages. We encourage manual verification.</p>
              </div>
              <div className="warning-card">
                <h4 className="font-bold text-lg mb-2 text-danger">Hidden Fees</h4>
                <p className="text-muted text-sm">Unexpected "transport spikes" added last minute. With us, your quote is final and inclusive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog */}
      <section className="section-padding" id="products">
        <div className="container">
          <h2 className="section-title">Our Materials</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card group">
                <div className="product-img-wrapper">
                  <Image 
                    src={product.img_path || '/sand-coarse.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
                <div className="product-info">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-bold border border-success/30">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-muted text-sm mb-6 leading-relaxed">{product.desc}</p>
                  <button className="btn-primary w-full" onClick={() => openModal(product.name)}>
                    Get Quote <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <button className="absolute top-6 right-6 text-muted hover:text-white" onClick={closeModal}><X /></button>
            <h3 className="text-2xl font-bold mb-2">Request Quote</h3>
            <p className="text-muted text-sm mb-8">For <strong>{selectedProduct}</strong></p>
            
            {submitState.success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/30">
                  <ShieldCheck size={40} className="text-success" />
                </div>
                <h4 className="text-xl font-bold mb-2">Verified!</h4>
                <p className="text-muted">Our fleet manager will contact you shortly with the best pricing.</p>
              </div>
            ) : (
              <div>
                {modalStage === 'CONTACT' && (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label>Mobile</label>
                        <input type="tel" placeholder="10 Digits" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} maxLength={10} required />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="OTP will be sent here" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                    </div>
                    {submitState.error && <p className="text-danger text-sm">{submitState.error}</p>}
                    <button type="submit" className="btn-primary w-full" disabled={submitState.loading}>
                      {submitState.loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    </button>
                  </form>
                )}

                {modalStage === 'OTP' && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <p className="text-sm text-primary mb-2">We sent a verification code to {formData.email}</p>
                      {sandboxOtp && (
                        <p className="text-xs font-mono bg-white/10 p-2 rounded border border-white/20 mt-2">
                          [TESTING CODE]: <span className="text-white font-bold">{sandboxOtp}</span>
                        </p>
                      )}
                    </div>
                    <div className="form-group">
                      <label>6-Digit Code</label>
                      <input type="text" placeholder="Enter Code" value={emailOtp} onChange={e => setEmailOtp(e.target.value)} maxLength={6} required />
                    </div>
                    <button type="submit" className="btn-primary w-full" disabled={submitState.loading}>
                      {submitState.loading ? 'Verifying...' : 'Verify & Proceed'}
                    </button>
                    <p className="text-center text-xs text-muted">Didn't get it? Check your spam folder.</p>
                  </form>
                )}

                {modalStage === 'DETAILS' && (
                  <form onSubmit={handleSubmitFinal} className="space-y-4">
                    <div className="form-group">
                      <label>Quantity Needed</label>
                      <input type="text" placeholder="e.g. 5 Loads / 5000 Bricks" value={orderDetails.quantity} onChange={e => setOrderDetails({ ...orderDetails, quantity: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Delivery Landmark</label>
                      <input type="text" placeholder="Full address" value={orderDetails.location} onChange={e => setOrderDetails({ ...orderDetails, location: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn-primary w-full" disabled={submitState.loading}>
                      Submit Quote Request
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
        <a href="https://wa.me/919490057579" target="_blank" rel="noreferrer" className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
          <MessageCircle className="text-white" />
        </a>
        <a href="tel:+919490057579" className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
          <Phone className="text-white" />
        </a>
      </div>

      <footer className="footer py-20 bg-slate-950 border-t border-white/5">
        <div className="container grid md:grid-cols-3 gap-12 text-sm">
          <div>
            <h4 className="text-white font-bold text-lg mb-6">SB Construction</h4>
            <p className="text-muted leading-relaxed">Providing high-quality construction materials directly to your site with 100% honesty.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Contact Details</h4>
            <div className="space-y-4">
              <p className="flex items-center gap-3"><Mail size={16} /> sbmcontsct5886@gmail.com</p>
              <p className="flex items-center gap-3"><Phone size={16} /> +91 9490 057 579</p>
              <p className="flex items-center gap-3"><MapPin size={16} /> Hyderabad, Telangana</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Transparency</h4>
            <p className="text-muted italic">"We don't count by guess, we count by honesty."</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
