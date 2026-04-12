'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, AlertTriangle, ShieldCheck, Truck, ChevronRight, X, Mail, MapPin, Package, Cpu, Layers } from 'lucide-react';
import Image from 'next/image';

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
        <div className="container hero-content text-center">
          <span className="hero-tagline animate-fade-in" style={{ animationDelay: '0.2s' }}>
            System Integrity Verified
          </span>
          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Next-Gen <br/>
            Structural <span className="text-primary">Suppliers</span>
          </h1>
          <p className="hero-desc animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Direct sourcing from digital-grade quarries. Optimized fleet logistics. 
            Zero redundancy. 100% architectural transparency.
          </p>
          <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <button className="btn-primary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
              Launch Catalog
            </button>
            <button className="btn-secondary" onClick={() => openModal('Instant Quote')}>
              Request Analytics
            </button>
          </div>
        </div>
      </section>

      {/* Structural Stats / Trust Blocks */}
      <section className="section-padding">
        <div className="container">
          <div className="about-grid">
            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="mb-8 inline-block p-4 bg-primary/10 border border-primary/20">
                <Cpu size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Automated Logistics</h3>
              <p className="text-muted leading-relaxed">Direct telemetry from our dedicated lorry fleet ensures real-time delivery precision without intermediaries.</p>
            </div>
            <div className="glass-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="mb-8 inline-block p-4 bg-success/10 border border-success/20">
                <Layers size={32} className="text-success" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Verified Materials</h3>
              <p className="text-muted leading-relaxed">Every structural unit is cross-verified for volume and density before dispatching to your coordinate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Alert / Market Awareness */}
      <section className="section-padding">
        <div className="container">
          <div className="awareness-banner">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="shrink-0">
                <AlertTriangle size={80} className="text-danger animate-pulse" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-black mb-4 uppercase">Market Vulnerability Warning</h2>
                <p className="text-muted mb-8 max-w-2xl">Traditional supply chains in Hyderabad are prone to structural quantity leakage and distracted unloading frauds.</p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 border-l-2 border-danger bg-danger/5">
                    <h4 className="font-bold text-danger uppercase mb-2">Volume Truncation</h4>
                    <p className="text-sm text-muted">Suppliers intentionally under-deliver bricks to inject fake margin into low-cost quotes.</p>
                  </div>
                  <div className="p-6 border-l-2 border-danger bg-danger/5">
                    <h4 className="font-bold text-danger uppercase mb-2">Manual Interception</h4>
                    <p className="text-sm text-muted">Manual counting distraction is used to hide real-time shortages during unloading phases.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog - Maintaining Quality & Size */}
      <section className="section-padding" id="products">
        <div className="container">
          <h2 className="section-title">Verified Inventory</h2>
          <div className="product-grid">
            {products.map((product, idx) => (
              <div key={product.id} className="product-card animate-fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                <div className="product-img-wrapper">
                  <Image 
                    src={product.img_path || '/sand-coarse.png'} 
                    alt={product.name} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    className="brightness-75"
                    quality={100} // Ensuring maximum quality
                    unoptimized
                  />
                  <div className="absolute top-4 left-4 px-2 py-1 bg-primary text-bg-dark text-[10px] font-bold uppercase tracking-widest">
                    ID: {product.id}
                  </div>
                </div>
                <div className="product-info">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black uppercase tracking-tight">{product.name}</h3>
                    <div className="text-primary font-mono text-sm border-b border-primary/30">
                      {product.price}
                    </div>
                  </div>
                  <p className="text-muted text-sm mb-8 leading-relaxed h-12 overflow-hidden">{product.desc}</p>
                  <button className="btn-primary w-full" onClick={() => openModal(product.name)}>
                    Initiate Quote <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Modal */}
      {modalOpen && (
        <div className="modal-overlay flex items-center justify-center p-4">
          <div className="modal-content relative animate-fade-in">
            <button className="absolute top-8 right-8 text-muted hover:text-primary transition-colors" onClick={closeModal}><X /></button>
            <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter">System Request</h3>
            <p className="text-muted text-sm mb-12">Deployment for: <span className="text-primary font-bold">{selectedProduct}</span></p>
            
            {submitState.success ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck size={48} className="text-success" />
                </div>
                <h4 className="text-2xl font-black uppercase mb-4">Verification Confirmed</h4>
                <p className="text-muted italic">Our system coordinator has been notified. Standby for contact.</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                {modalStage === 'CONTACT' && (
                  <form onSubmit={handleSendOTP} className="space-y-6">
                    <div className="form-group flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Field: Operator Name</label>
                      <input className="w-full" type="text" placeholder="REQUIRED" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="form-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Field: Network Link</label>
                        <input className="w-full" type="tel" placeholder="10 DIGITS" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} maxLength={10} required />
                      </div>
                      <div className="form-group flex flex-col gap-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Field: Logic Address</label>
                        <input className="w-full" type="email" placeholder="ACTIVE EMAIL" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                    </div>
                    {submitState.error && <p className="text-danger text-xs font-mono">{submitState.error}</p>}
                    <button type="submit" className="btn-primary w-full mt-4" disabled={submitState.loading}>
                      {submitState.loading ? 'Transmitting...' : 'Send Access Key'}
                    </button>
                  </form>
                )}

                {modalStage === 'OTP' && (
                  <form onSubmit={handleVerifyOTP} className="space-y-8">
                    <div className="p-6 bg-primary/5 border border-primary/10">
                      <p className="text-xs text-muted uppercase tracking-widest leading-loose">
                        A unique access key has been dispatched to <span className="text-primary">{formData.email}</span>.
                      </p>
                      {sandboxOtp && (
                        <p className="text-[10px] font-mono p-4 bg-white/5 border border-white/10 mt-4">
                          [MANUAL_BYPASS]: <span className="text-primary font-bold">{sandboxOtp}</span>
                        </p>
                      )}
                    </div>
                    <div className="form-group flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Input: Access Key</label>
                      <input className="w-full text-center text-2xl tracking-[0.5em] font-black" type="text" placeholder="******" value={emailOtp} onChange={e => setEmailOtp(e.target.value)} maxLength={6} required />
                    </div>
                    <button type="submit" className="btn-primary w-full" disabled={submitState.loading}>
                      {submitState.loading ? 'Authenticating...' : 'Validate & Open Link'}
                    </button>
                  </form>
                )}

                {modalStage === 'DETAILS' && (
                  <form onSubmit={handleSubmitFinal} className="space-y-6">
                    <div className="form-group flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Input: Volume Load</label>
                      <input className="w-full" type="text" placeholder="QUANTITY SPECS" value={orderDetails.quantity} onChange={e => setOrderDetails({ ...orderDetails, quantity: e.target.value })} required />
                    </div>
                    <div className="form-group flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Input: Target Coordinate</label>
                      <input className="w-full" type="text" placeholder="DELIVERY ADDRESS" value={orderDetails.location} onChange={e => setOrderDetails({ ...orderDetails, location: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-4" disabled={submitState.loading}>
                      Finalize Request
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Actions */}
      <div className="fixed bottom-12 right-12 flex flex-col gap-6 z-50">
        <a href="https://wa.me/919490057579" target="_blank" rel="noreferrer" className="w-16 h-16 bg-[#25D366] rounded-none flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform">
          <MessageCircle className="text-white" />
        </a>
        <a href="tel:+919490057579" className="w-16 h-16 bg-primary rounded-none flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)] hover:scale-110 transition-transform">
          <Phone className="text-bg-dark" />
        </a>
      </div>

      <footer className="footer py-32 bg-bg-dark border-t border-primary/10">
        <div className="container grid md:grid-cols-3 gap-24 text-[10px] uppercase tracking-[0.2em]">
          <div>
            <h4 className="text-primary font-black text-xl mb-12 tracking-tighter">SB CONSTRUCTION</h4>
            <p className="text-muted leading-loose">Structural material engineering and supply. Zero-latency delivery protocols for Hyderabad high-rises.</p>
          </div>
          <div className="flex flex-col gap-8">
            <h4 className="text-white font-bold mb-4">Contact Matrix</h4>
            <p className="flex items-center gap-4 text-muted"><Mail size={12} className="text-primary" /> sbmcontsct5886@gmail.com</p>
            <p className="flex items-center gap-4 text-muted"><Phone size={12} className="text-primary" /> +91 9490 057 579</p>
            <p className="flex items-center gap-4 text-muted"><MapPin size={12} className="text-primary" /> Hyderabad Segment, TS</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Integrity Protocol</h4>
            <p className="text-muted italic leading-loose border-l border-primary/20 pl-6">"WE DON'T ESTIMATE. WE VERIFY SUCCESS THROUGH STRUCTURAL HONESTY."</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
