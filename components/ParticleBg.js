'use client';

import { useEffect, useRef } from 'react';

export default function AntigravityBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 150;
    const mouse = { x: null, y: null, radius: 150 };
    
    // Google-style vibrant palette
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#7091E6'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        // Initial center-weighted distribution
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 300;
        this.baseX = window.innerWidth / 2 + Math.cos(angle) * radius;
        this.baseY = window.innerHeight / 2.5 + Math.sin(angle) * radius;
        
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.density = (Math.random() * 30) + 1; // Movement resistance
        this.angle = Math.random() * 360; // For floating motion
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        // Add a subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
      }

      update() {
        // Floating motion
        this.angle += 0.02;
        const floatX = Math.cos(this.angle) * 0.5;
        const floatY = Math.sin(this.angle) * 0.5;

        // Interaction (Attract to cursor)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius * 2) {
            // Gentle gravitational pull towards the cursor
            this.x += (dx / distance) * 0.5 * this.density;
            this.y += (dy / distance) * 0.5 * this.density;
          } else {
            // Return to base position softly
            if (this.x !== this.baseX) {
              this.x += (this.baseX - this.x) / 40;
            }
            if (this.y !== this.baseY) {
              this.y += (this.baseY - this.y) / 40;
            }
          }
        } else {
           // No mouse, return to base
           if (this.x !== this.baseX) {
              this.x += (this.baseX - this.x) / 40;
           }
           if (this.y !== this.baseY) {
              this.y += (this.baseY - this.y) / 40;
           }
        }
        
        this.x += floatX;
        this.y += floatY;
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
