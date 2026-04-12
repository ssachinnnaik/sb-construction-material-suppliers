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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0f172a]">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-24 h-24 border-4 border-slate-800 border-t-[#7091E6] rounded-full animate-spin"></div>
        {/* Inner Pulsing Dot */}
        <div className="absolute w-8 h-8 bg-[#7091E6]/20 rounded-full animate-pulse flex items-center justify-center">
           <div className="w-2 h-2 bg-[#7091E6] rounded-full"></div>
        </div>
        {/* Label */}
        <p className="absolute -bottom-12 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-[#7091E6] font-bold animate-pulse">
          Loading Quality...
        </p>
      </div>
    </div>
  );
}
