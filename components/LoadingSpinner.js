'use client';

import { useEffect, useState } from 'react';

const PHASES = [
  { id: 'brick',   label: 'Sourcing Karimnagar Bricks',   color: '#A53F3F', glow: 'rgba(165,63,63,0.6)' },
  { id: 'sand',    label: 'Loading River Sand',            color: '#D2A850', glow: 'rgba(210,168,80,0.6)' },
  { id: 'steel',   label: 'Reinforcing Steel Bars',        color: '#94a3b8', glow: 'rgba(148,163,184,0.6)' },
  { id: 'cement',  label: 'Mixing Premium Cement',         color: '#b0a99f', glow: 'rgba(176,169,159,0.6)' },
];

export default function LoadingSpinner() {
  const [phase, setPhase]       = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Advance progress every 40ms
    const prog = setInterval(() => {
      setProgress(p => (p >= 100 ? 100 : p + 1));
    }, 40);

    // Cycle phases every 1s
    const phas = setInterval(() => {
      setPhase(p => (p + 1) % PHASES.length);
    }, 1000);

    return () => { clearInterval(prog); clearInterval(phas); };
  }, []);

  const current = PHASES[phase];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a0e0e 0%, #2D1C16 50%, #1a120e 100%)',
      overflow: 'hidden',
    }}>
      {/* Animated falling bricks background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 13) % 100}%`,
            top: '-60px',
            width: '44px', height: '22px',
            background: '#A53F3F',
            border: '1px solid #7A2222',
            borderRadius: '2px',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.4)',
            opacity: 0.15,
            animation: `bgBrickFall ${3 + (i % 4)}s ${i * 0.4}s linear infinite`,
          }} />
        ))}
      </div>

      {/* Sand particle stream */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${(i * 7) % 100}%`,
            width: '3px', height: '3px',
            borderRadius: '50%',
            background: '#D2A850',
            opacity: 0.25,
            animation: `sandDrift ${2 + (i % 3)}s ${i * 0.25}s ease-in infinite`,
          }} />
        ))}
      </div>

      {/* === Main Loader === */}
      <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Outer orbit ring */}
        <div style={{
          position: 'absolute',
          width: '200px', height: '200px',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'orbitSpin 8s linear infinite',
        }}>
          {/* Orbiting brick dot */}
          <div style={{
            position: 'absolute',
            top: '-6px', left: '50%', transform: 'translateX(-50%)',
            width: '12px', height: '6px',
            background: current.color,
            borderRadius: '2px',
            boxShadow: `0 0 10px ${current.glow}`,
            transition: 'background 0.4s, box-shadow 0.4s',
          }} />
        </div>

        {/* Middle spinning ring */}
        <div style={{
          position: 'absolute',
          width: '160px', height: '160px',
          border: `3px solid transparent`,
          borderTop: `3px solid ${current.color}`,
          borderBottom: `3px solid ${current.color}`,
          borderRadius: '50%',
          animation: 'midSpin 1.8s linear infinite',
          boxShadow: `0 0 20px ${current.glow}`,
          transition: 'border-color 0.4s, box-shadow 0.4s',
        }} />

        {/* Inner counter-ring */}
        <div style={{
          position: 'absolute',
          width: '120px', height: '120px',
          border: '2px solid rgba(255,255,255,0.06)',
          borderLeft: `2px solid ${current.color}`,
          borderRight: `2px solid ${current.color}`,
          borderRadius: '50%',
          animation: 'midSpin 2.5s linear infinite reverse',
          transition: 'border-color 0.4s',
        }} />

        {/* Centre construction icon */}
        <div style={{
          position: 'absolute',
          width: '90px', height: '90px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '6px',
          animation: 'pulseBreathe 2s ease-in-out infinite',
        }}>
          {/* Phase-specific icon */}
          {phase === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[1,2,3].map(r => (
                <div key={r} style={{
                  width: r % 2 === 0 ? 44 : 50,
                  height: 11,
                  background: 'linear-gradient(135deg, #C0514A, #A53F3F)',
                  borderRadius: '2px',
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2)',
                }} />
              ))}
            </div>
          )}
          {phase === 1 && (
            <div style={{ position: 'relative', width: 50, height: 50 }}>
              {/* Sand pile SVG-style */}
              <div style={{
                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: 50, height: 30,
                background: 'linear-gradient(to top, #D2A850, #E0C070)',
                borderRadius: '50% 50% 0 0',
                boxShadow: '0 0 15px rgba(210,168,80,0.5)',
              }} />
              <div style={{
                position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
                width: 6, height: 20,
                background: 'rgba(210,168,80,0.9)',
                borderRadius: '3px',
                animation: 'sandStream 0.5s linear infinite',
              }} />
            </div>
          )}
          {phase === 2 && (
            <div style={{ position: 'relative', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[0, 45, 90, 135].map(deg => (
                <div key={deg} style={{
                  position: 'absolute',
                  width: '6px', height: '44px',
                  background: 'linear-gradient(to bottom, #666, #ccc, #666)',
                  borderRadius: '3px',
                  transform: `rotate(${deg}deg)`,
                  boxShadow: '0 0 8px rgba(255,255,255,0.4)',
                }} />
              ))}
            </div>
          )}
          {phase === 3 && (
            <div style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #ccc, #b0a99f, #888)',
              borderRadius: '6px',
              boxShadow: 'inset 4px 4px 8px rgba(255,255,255,0.4), inset -4px -4px 8px rgba(0,0,0,0.6), 0 0 20px rgba(176,169,159,0.5)',
              animation: 'cementPulse 1s ease-in-out infinite alternate',
            }} />
          )}
        </div>
      </div>

      {/* Phase label */}
      <p style={{
        marginTop: '2rem',
        color: current.color,
        fontSize: '0.75rem',
        fontWeight: '800',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        textShadow: `0 0 15px ${current.glow}`,
        transition: 'color 0.4s, text-shadow 0.4s',
        fontFamily: 'Inter, sans-serif',
        animation: 'fadeLabel 1s ease-in-out',
      }}>
        {current.label}
      </p>

      {/* Progress bar */}
      <div style={{
        marginTop: '1.5rem',
        width: 'min(280px, 80vw)',
        height: '4px',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(to right, ${current.color}, ${current.glow})`,
          borderRadius: '2px',
          transition: 'width 0.05s linear, background 0.4s',
          boxShadow: `0 0 8px ${current.glow}`,
        }} />
      </div>

      {/* Brand name */}
      <p style={{
        marginTop: '1.5rem',
        color: 'rgba(255,255,255,0.35)',
        fontSize: '0.7rem',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        fontFamily: 'Inter, sans-serif',
      }}>
        SB CONSTRUCTION
      </p>

      {/* Keyframe styles */}
      <style>{`
        @keyframes bgBrickFall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0;    }
          10%  { opacity: 0.15; }
          90%  { opacity: 0.10; }
          100% { transform: translateY(110vh) rotate(40deg); opacity: 0; }
        }
        @keyframes sandDrift {
          0%   { transform: translateY(-20px); opacity: 0;    }
          20%  { opacity: 0.4; }
          80%  { opacity: 0.25; }
          100% { transform: translateY(110vh);  opacity: 0;   }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes midSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseBreathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.06); }
        }
        @keyframes sandStream {
          0%   { opacity: 0; transform: translateY(-8px); }
          50%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(8px);  }
        }
        @keyframes cementPulse {
          from { box-shadow: inset 4px 4px 8px rgba(255,255,255,0.4), inset -4px -4px 8px rgba(0,0,0,0.6), 0 0 10px rgba(176,169,159,0.3); }
          to   { box-shadow: inset 4px 4px 8px rgba(255,255,255,0.2), inset -4px -4px 8px rgba(0,0,0,0.8), 0 0 30px rgba(176,169,159,0.7); }
        }
        @keyframes fadeLabel {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}
