'use client';
import React from 'react';

export default function CustomLoader() {
  return (
    <div className="custom-loader-wrapper" style={{ gridColumn: '1 / -1', margin: '4rem 0' }}>
      <div className="advanced-loader">
        <div className="loader-orbit">
          <div className="mini-brick lb-1"></div>
          <div className="mini-brick lb-2"></div>
          <div className="mini-brick lb-3"></div>
          <div className="mini-brick lb-4"></div>
        </div>
        <div className="loader-sand-pile"></div>
        <div className="loader-cement-block"></div>
      </div>
      <p style={{ color: '#2D1C16', fontSize: '1.2rem', fontWeight: '800', textShadow: '2px 2px 0 #fff' }}>
        Synthesizing premium materials...
      </p>
    </div>
  );
}
