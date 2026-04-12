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
    const particleCount = 200; // Increased count for better visual
    const mouse = { x: null, y: null, radius: 250 }; // Larger radius for natural flow
    
    // Google-style vibrant palette
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#7091E6'];

    let titleCenterX = window.innerWidth / 2;
    let titleCenterY = window.innerHeight / 2.5;

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Try to find exact title coordinates to perfectly fall behind the text
      const titleEl = document.querySelector('.hero-title');
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        titleCenterX = titleRect.left - rect.left + titleRect.width / 2;
        titleCenterY = titleRect.top - rect.top + titleRect.height / 2;
      } else {
        titleCenterX = canvas.width / 2;
        titleCenterY = canvas.height / 2;
      }
      
      init();
    };

    window.addEventListener('resize', resize);
    
    // Initial setup needs a tiny delay to ensure fonts/layout have painted
    setTimeout(resize, 100);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    class Particle {
      constructor() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 350; // Spread wide around the title
        
        // Base coordinate is exactly the center of the title
        this.baseX = titleCenterX + Math.cos(angle) * Math.sqrt(radius) * 15;
        this.baseY = titleCenterY + Math.sin(angle) * Math.sqrt(radius) * 10;
        
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * 3.5 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.density = (Math.random() * 30) + 1; 
        this.angle = Math.random() * 360; 
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
      }

      update() {
        this.angle += 0.02;
        const floatX = Math.cos(this.angle) * 0.5;
        const floatY = Math.sin(this.angle) * 0.5;

        // Interaction (Attract to cursor)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Flow towards and orbit the cursor gently
            this.x += (dx / distance) * 0.8 * this.density;
            this.y += (dy / distance) * 0.8 * this.density;
          } else {
            // Return to where it belongs smoothly
            if (this.x !== this.baseX) {
              this.x += (this.baseX - this.x) / 50;
            }
            if (this.y !== this.baseY) {
              this.y += (this.baseY - this.y) / 50;
            }
          }
        } else {
           // No mouse, idle flow at the base
           if (this.x !== this.baseX) {
              this.x += (this.baseX - this.x) / 50;
           }
           if (this.y !== this.baseY) {
              this.y += (this.baseY - this.y) / 50;
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
      style={{ opacity: 0.7 }}
    />
  );
}
