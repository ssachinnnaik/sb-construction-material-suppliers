'use client';
import React, { useState, useEffect } from 'react';
import { Calculator, ShoppingCart } from 'lucide-react';

const materialPrices = {
  'coarse-sand': { name: 'Coarse Sand', price: 1200, unit: 'Ton' },
  'fine-sand': { name: 'Fine Sand', price: 1100, unit: 'Ton' },
  'karimnagar-bricks': { name: 'Karimnagar Bricks', price: 9, unit: 'Brick' },
  'local-bricks': { name: 'Local Bricks', price: 6, unit: 'Brick' },
};

export default function CostEstimator({ onQuoteRequest }) {
  const [selectedMaterial, setSelectedMaterial] = useState('coarse-sand');
  const [quantity, setQuantity] = useState(1);
  const [totalCost, setTotalCost] = useState(1200);

  useEffect(() => {
    const rate = materialPrices[selectedMaterial].price;
    setTotalCost(rate * quantity);
  }, [selectedMaterial, quantity]);

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
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#4E342E' }}>Select Material</label>
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
                Quantity Required ({materialPrices[selectedMaterial].unit}s): <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>{quantity}</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max={materialPrices[selectedMaterial].unit === 'Brick' ? 20000 : 50} 
                step={materialPrices[selectedMaterial].unit === 'Brick' ? 500 : 1}
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', height: '8px' }}
              />
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '8px', borderLeft: '5px solid var(--success)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#5D4037', fontSize: '0.9rem', textTransform: 'uppercase' }}>Estimated Material Cost</p>
                <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'var(--success)' }}>
                  ₹{totalCost.toLocaleString('en-IN')}
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#5D4037' }}>*Transport fees calculated separately at delivery</p>
              </div>
              <button 
                onClick={() => onQuoteRequest(`${materialPrices[selectedMaterial].name} - Estimated ${quantity} ${materialPrices[selectedMaterial].unit}s`)} 
                className="btn-primary" 
                style={{ fontSize: '1.1rem', padding: '1rem 2rem', background: 'var(--success)', border: '1px solid #1b5e20', boxShadow: '0 5px 0 #1b5e20' }}
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
