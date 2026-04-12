'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, AlertTriangle, ShieldCheck, Truck, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import ParticleBg from '@/components/ParticleBg';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

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

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved
        }
      });
    }
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
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = '+91' + formData.mobile;
      
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;

      setModalStage('OTP');
      setSubmitState({ loading: false, success: false, error: '' });
      
    } catch (err) {
      console.error(err);
      if (window.recaptchaVerifier) {
        // Reset recaptcha on failure
        window.recaptchaVerifier.render().then(widgetId => grecaptcha.reset(widgetId)).catch(() => {});
      }
      setSubmitState({ loading: false, success: false, error: 'SMS failed. Check phone number format or try again later.' });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false, error: '' });

    if (!emailOtp) {
      return setSubmitState({ loading: false, success: false, error: 'OTP is required.' });
    }

    try {
      if (!window.confirmationResult) {
         throw new Error("Session expired. Please request OTP again.");
      }
      
      await window.confirmationResult.confirm(emailOtp);

      setModalStage('DETAILS');
      setSubmitState({ loading: false, success: false, error: '' });
    } catch (err) {
      console.error(err);
      setSubmitState({ loading: false, success: false, error: 'Invalid SMS OTP or expired.' });
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
        throw new Error(lData.error || 'Order submission failed.');
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
        <div className="container hero-content">
          <h1 className="hero-title">
            <span className="text-primary">SB</span> CONSTRUCTION <br/> MATERIALS SUPPLIERS
          </h1>
          <p className="hero-tagline">Trusted Construction Material Suppliers in Hyderabad</p>
          <p className="hero-desc">
            Direct supply using our own lorries. Zero middlemen. Uncompromised honesty and premium quality for your build.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => window.scrollTo({ top: document.getElementById('products').offsetTop, behavior: 'smooth' })}>
              Explore Products
            </button>
            <button className="btn-secondary" onClick={() => openModal('General Inquiry')}>
              Get Quote Now
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about section-padding" id="about">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <div className="about-grid">
            <div className="about-card">
              <Truck size={40} className="text-primary mb-4" />
              <h3>Direct Transport</h3>
              <p>We own our lorry fleet. This means no delay, right-on-time delivery, and reduced costs passed entirely to you.</p>
            </div>
            <div className="about-card">
              <ShieldCheck size={40} className="text-primary mb-4" />
              <h3>Premium Quality</h3>
              <p>Sourcing directly from top sites including premium Karimnagar red bricks and high-grade river sand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Awareness Section - Warning User about Market Frauds */}
      <section className="awareness section-padding">
        <div className="container">
          <div className="awareness-banner">
            <AlertTriangle size={60} className="text-danger bounce-anim" />
            <h2 className="warning-title">Beware of False Promises by Other Suppliers</h2>
            
            <div className="warning-grid">
              <div className="warning-card">
                <h4>🔴 Fake Low Pricing Traps</h4>
                <p>Suppliers tempt you with extremely low rates upfront, only to compensate by cutting product quantity or quality covertly.</p>
              </div>
              <div className="warning-card">
                <h4>🔴 The Hidden "Brick Deduction" Fraud</h4>
                <p>A widely used trick: Removing every 100th brick during loading or unloading. You lose money without even noticing!</p>
              </div>
              <div className="warning-card">
                <h4>🔴 Distraction Tactics</h4>
                <p>Delivery agents often distract site supervisors while unloading, tampering with the actual counted volume of sand or bricks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-us section-padding">
        <div className="container">
          <h2 className="section-title">Why Choose SB Construction?</h2>
          <ul className="trust-list">
            <li><ShieldCheck className="text-success" /> 100% Transparency in pricing and volume.</li>
            <li><ShieldCheck className="text-success" /> Honest, manual verification counting system.</li>
            <li><ShieldCheck className="text-success" /> No hidden tricks, no sudden extra transport fees.</li>
            <li><ShieldCheck className="text-success" /> Customer-first service focused on building long-term trust.</li>
            <li><ShieldCheck className="text-success" /> Highly trusted supplier across all of Hyderabad and nearby areas.</li>
          </ul>
        </div>
      </section>

      {/* Products Section */}
      <section className="products section-padding" id="products">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          <div className="product-grid">
            {products.length === 0 ? <p className="text-center w-full mt-4">Loading catalog...</p> : null}
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrapper" style={{ overflow: 'hidden' }}>
                  <Image src={product.img_path || '/sand-coarse.png'} alt={product.name} width={400} height={200} style={{ objectFit: 'cover', width: '100%', height: '200px', display: 'block' }} unoptimized />
                </div>
                <div className="product-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ width: '70%' }}>{product.name}</h3>
                    {product.price && <span style={{ background: '#D0EDDA', color: '#1a1a1a', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>{product.price}</span>}
                  </div>
                  <p>{product.desc}</p>
                  <button className="btn-outline-primary mt-4" onClick={() => openModal(product.name)}>
                    Get Details <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <a href="https://wa.me/919490057579" target="_blank" rel="noreferrer" className="fab fab-whatsapp">
          <MessageCircle />
        </a>
        <a href="tel:+919490057579" className="fab fab-call">
          <Phone />
        </a>
      </div>

      {/* Lead Capture Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}><X /></button>
            <h3 className="modal-title">Get a Free Quote</h3>
            <p className="modal-subtitle">Interested in <strong>{selectedProduct}</strong>? Leave your details below and we will contact you immediately.</p>
            
            {submitState.success ? (
              <div className="success-msg">
                <ShieldCheck size={48} className="text-success mx-auto" />
                <p>Verification Success! Our team has been notified and will contact you shortly.</p>
              </div>
            ) : (
              <div className="lead-modal-stages">
                <div id="recaptcha-container"></div>
                {modalStage === 'CONTACT' && (
                  <form onSubmit={handleSendOTP} className="lead-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        disabled={submitState.loading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number</label>
                      <input 
                        type="tel" 
                        placeholder="Enter 10-digit mobile number" 
                        value={formData.mobile} 
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        maxLength={10}
                        disabled={submitState.loading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        placeholder="Enter email to receive OTP" 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        disabled={submitState.loading}
                        required
                      />
                    </div>
                    {submitState.error && <p className="error-msg">{submitState.error}</p>}
                    <button type="submit" className="btn-primary w-full mt-2" disabled={submitState.loading}>
                      {submitState.loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" opacity="0.8"></circle>
                          </svg>
                          Requesting OTP...
                        </span>
                      ) : 'Send SMS Verification OTP'}
                    </button>
                  </form>
                )}

                {modalStage === 'OTP' && (
                  <form onSubmit={handleVerifyOTP} className="lead-form">
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                      Security check: We just sent a 6-Digit SMS code to <strong>+91 {formData.mobile}</strong>. Please enter it below.
                    </p>
                    <div className="form-group">
                      <label>SMS OTP</label>
                      <input 
                        type="text" 
                        placeholder="Enter 6-Digit SMS Code" 
                        value={emailOtp} 
                        onChange={e => setEmailOtp(e.target.value)}
                        maxLength={6}
                        disabled={submitState.loading}
                        required
                      />
                    </div>
                    {submitState.error && <p className="error-msg">{submitState.error}</p>}
                    <button type="submit" className="btn-primary w-full mt-2" disabled={submitState.loading}>
                      {submitState.loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" opacity="0.8"></circle>
                          </svg>
                          Verifying identity...
                        </span>
                      ) : 'Verify OTP'}
                    </button>
                  </form>
                )}

                {modalStage === 'DETAILS' && (
                  <form onSubmit={handleSubmitFinal} className="lead-form">
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: '600' }}>
                      ✅ Phone Number Verified! Please provide your order details to proceed.
                    </p>
                    <div className="form-group">
                      <label>Actual Quantity Needed</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 5 Loads / 3000 Bricks" 
                        value={orderDetails.quantity} 
                        onChange={e => setOrderDetails({ ...orderDetails, quantity: e.target.value })}
                        disabled={submitState.loading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Delivery Site Location</label>
                      <input 
                        type="text" 
                        placeholder="Full address or landmark" 
                        value={orderDetails.location} 
                        onChange={e => setOrderDetails({ ...orderDetails, location: e.target.value })}
                        disabled={submitState.loading}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Upcoming Load Quantity (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Any future requirements?" 
                        value={orderDetails.upcoming} 
                        onChange={e => setOrderDetails({ ...orderDetails, upcoming: e.target.value })}
                        disabled={submitState.loading}
                      />
                    </div>
                    {submitState.error && <p className="error-msg">{submitState.error}</p>}
                    <button type="submit" className="btn-primary w-full mt-2" disabled={submitState.loading}>
                      {submitState.loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" opacity="0.8"></circle>
                          </svg>
                          Submitting Order...
                        </span>
                      ) : 'Confirm & Submit Order'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer section-padding">
        <div className="container text-center">
          <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            <strong>Contact Us:</strong> <br/>
            Email: <a href="mailto:sbmcontsct5886@gmail.com" style={{ textDecoration: 'underline' }}>sbmcontsct5886@gmail.com</a> | 
            Phone: <a href="tel:+919490057579" style={{ textDecoration: 'underline' }}>+91 9490 057 579</a>
          </p>
          <p style={{ marginTop: '2rem' }}>&copy; {new Date().getFullYear()} SB Construction Materials Suppliers. Serving Hyderabad.</p>
        </div>
      </footer>
    </main>
  );
}
