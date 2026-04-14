'use client';
import React, { useState, useEffect } from 'react';
import { Calculator, ShoppingCart, RefreshCw } from 'lucide-react';

export default function CostEstimator({ onQuoteRequest }) {
  const [materialPrices, setMaterialPrices] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const loadedPrices = {};
        let firstMat = '';

        if (data.products && data.products.length > 0) {
          data.products.forEach((prod, index) => {
            // Regex to extract number (e.g. "₹1200 / Ton" -> 1200)
            const numMatch = prod.price ? prod.price.match(/\d+(\.\d+)?/) : null;
            const price = numMatch ? parseFloat(numMatch[0]) : 0;
            
            // Regex to extract unit (e.g. "₹1200 / Ton" -> "Ton")
            const unitMatch = prod.price ? prod.price.match(/\/\s*([a-zA-Z]+)/) : null;
            let unit = unitMatch ? unitMatch[1].trim() : 'Unit';
            if(unit.toLowerCase() === 'brick') unit = 'Brick';
            if(unit.toLowerCase() === 'bag') unit = 'Bag';
            
            loadedPrices[prod.id] = { name: prod.name, price, unit };
            if (index === 0) firstMat = prod.id;
          });
          setMaterialPrices(loadedPrices);
          setSelectedMaterial(firstMat);
        }
      } catch (e) {
        console.error("Failed to load DB products for estimator", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedMaterial && materialPrices[selectedMaterial]) {
      const rate = materialPrices[selectedMaterial].price;
      setTotalCost(rate * quantity);
    }
  }, [selectedMaterial, quantity, materialPrices]);

  if (loading) return (
    <section className="estimator-section section-padding" style={{ position: 'relative', zIndex: 5 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <RefreshCw size={40} className="text-primary spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: '#5D4037', fontWeight: 'bold' }}>Syncing live inventory rates...</p>
      </div>
    </section>
  );

  if (!selectedMaterial || Object.keys(materialPrices).length === 0) {
    return null; // Don't show if db is empty
  }

  const activeMaterial = materialPrices[selectedMaterial];

  return (
    <section className="estimator-section section-padding" style={{ position: 'relative', zIndex: 5 }}>
      <div className="container">
        <h2 className="section-title">Live Cost Estimator</h2>
        
        <div className="awareness-banner" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: '1rem' }}>
            <Calculator size={36} className="text-primary" />
            <h3 style={{ fontSize: '1.6rem', color: '#2D1C16', margin: 0 }}>Calculate Your Project</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#4E342E' }}>Select Material (Live DB Rates)</label>
              <select 
                value={selectedMaterial} 
                onChange={(e) => {
                  setSelectedMaterial(e.target.value);
                  setQuantity(1);
                }}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '2px solid var(--primary)', background: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', fontWeight: 'bold', color: '#2D1C16' }}
              >
                {Object.entries(materialPrices).map(([key, data]) => (
                  <option key={key} value={key}>{data.name} (₹{data.price} / {data.unit})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#4E342E' }}>
                Quantity Required ({activeMaterial.unit}s): <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{quantity}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max={activeMaterial.unit.includes('Brick') ? 20000 : 100} 
                step={activeMaterial.unit.includes('Brick') ? 500 : 1}
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', height: '8px' }}
              />
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '8px', borderLeft: '5px solid var(--success)', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div style={{ flex: '1 1 200px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#5D4037', fontSize: '0.9rem', textTransform: 'uppercase' }}>Estimated Material Cost</p>
                <p style={{ margin: 0, fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '900', color: 'var(--success)' }}>
                  ₹{totalCost.toLocaleString('en-IN')}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#5D4037' }}>*Total cost inclusive of standard transport charges</p>
              </div>
              <button 
                onClick={() => onQuoteRequest(`${activeMaterial.name} - Estimated ${quantity} ${activeMaterial.unit}s`)} 
                className="btn-primary" 
                style={{ fontSize: '1rem', padding: '0.8rem 1.5rem', background: 'var(--success)', border: '1px solid #1b5e20', boxShadow: '0 5px 0 #1b5e20', flex: '1 1 auto', whiteSpace: 'nowrap' }}
              >
                <ShoppingCart size={20} /> Request Exact Quote
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
