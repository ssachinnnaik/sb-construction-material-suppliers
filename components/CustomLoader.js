'use client';
import React from 'react';

export default function CustomLoader() {
  return (
    <div className="custom-loader-wrapper" style={{ gridColumn: '1 / -1', margin: '4rem 0' }}>
      <div className="extreme-loader-ring">
        <div className="extreme-loader">
          {/* Phase 1: Rotating Brick */}
          <div className="seq-brick">
            <div className="brick-face"></div>
          </div>
          
          {/* Phase 2: Rotating Steel Rebar */}
          <div className="seq-steel">
            <div className="steel-rod"></div>
            <div className="steel-rod sr2"></div>
          </div>

          {/* Phase 3: Sand Tornado */}
          <div className="seq-sand"></div>

          {/* Phase 4: Cement Drop */}
          <div className="seq-cement"></div>
        </div>
      </div>
      <p className="loading-text" style={{ color: '#2D1C16', fontSize: '1.4rem', fontWeight: '900', textShadow: '2px 2px 5px rgba(255,255,255,0.8), 0 0 20px rgba(230, 81, 0, 0.4)', marginTop: '1.5rem', letterSpacing: '2px' }}>
        SYNTHESIZING PREMIUM MATERIALS...
      </p>
    </div>
  );
}
