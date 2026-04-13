'use client';
import React, { useEffect, useState } from 'react';

export default function SiteSimulation() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate some random bricks and sand streams on mount
    const newElements = [];
    
    // Generate 5 falling bricks
    for (let i = 0; i < 5; i++) {
      newElements.push({
        type: 'brick',
        id: `brick-${i}`,
        left: `${Math.random() * 15}%`, // left side
        duration: `${4 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`
      });
      // some on right side
      newElements.push({
        type: 'brick',
        id: `brick-r-${i}`,
        left: `${85 + Math.random() * 10}%`, // right side
        duration: `${4 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`
      });
    }

    // Generate 2 sand streams
    newElements.push({
      type: 'sand',
      id: 'sand-1',
      left: '5%',
      duration: '6s',
      delay: '1s'
    });
    newElements.push({
      type: 'sand',
      id: 'sand-2',
      left: '92%',
      duration: '5s',
      delay: '3s'
    });

    setElements(newElements);
  }, []);

  return (
    <div className="site-simulation">
      {elements.map(el => {
        if (el.type === 'brick') {
          return (
            <div 
              key={el.id} 
              className="sim-brick" 
              style={{
                left: el.left,
                animationDuration: el.duration,
                animationDelay: el.delay
              }}
            />
          );
        }
        if (el.type === 'sand') {
          return (
            <div 
              key={el.id} 
              className="sim-sand-stream" 
              style={{
                left: el.left,
                animationDuration: el.duration,
                animationDelay: el.delay
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
