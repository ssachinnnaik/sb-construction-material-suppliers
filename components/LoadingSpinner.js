'use client';

import { useEffect, useState } from 'react';

export default function LoadingSpinner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial site load simulation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      backgroundColor: '#1a254f'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer Ring - Spins Forward */}
        <div className="animate-spin" style={{
          width: '80px', height: '80px',
          border: '4px solid rgba(173, 187, 218, 0.2)',
          borderTop: '4px solid #7091E6',
          borderRadius: '50%',
          position: 'absolute'
        }}></div>
        
        {/* Inner Ring - Spins Backward */}
        <div className="animate-spin" style={{
          width: '50px', height: '50px',
          border: '3px solid rgba(237, 232, 245, 0.1)',
          borderBottom: '3px solid #ADBBDA',
          borderRadius: '50%',
          position: 'absolute',
          animationDirection: 'reverse',
          animationDuration: '1.5s'
        }}></div>

        {/* Central Core */}
        <div className="animate-pulse" style={{
          width: '16px', height: '16px', 
          backgroundColor: '#7091E6', 
          borderRadius: '50%',
          boxShadow: '0 0 15px #7091E6'
        }}></div>

        {/* Label */}
        <p className="animate-pulse" style={{
          position: 'absolute', bottom: '-60px', whiteSpace: 'nowrap',
          fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px',
          color: '#ADBBDA', fontWeight: 'bold'
        }}>
          Loading Framework...
        </p>
      </div>
    </div>
  );
}
