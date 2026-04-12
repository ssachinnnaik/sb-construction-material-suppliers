'use client';

import { useEffect, useState } from 'react';

export default function UniqueLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="loader-container">
      <div className="block-loader">
        <div className="block-face" style={{ transform: 'translateZ(30px)' }}></div>
        <div className="block-face" style={{ transform: 'rotateY(90deg) translateZ(30px)' }}></div>
        <div className="block-face" style={{ transform: 'rotateY(180deg) translateZ(30px)' }}></div>
        <div className="block-face" style={{ transform: 'rotateY(-90deg) translateZ(30px)' }}></div>
        <div className="block-face" style={{ transform: 'rotateX(90deg) translateZ(30px)' }}></div>
        <div className="block-face" style={{ transform: 'rotateX(-90deg) translateZ(30px)' }}></div>
      </div>
      <div className="absolute mt-32 text-xs font-mono tracking-widest text-primary uppercase animate-pulse">
        Initializing Structural Grid...
      </div>
    </div>
  );
}
