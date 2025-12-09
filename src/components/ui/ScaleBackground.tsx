"use client";

import React, { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';

interface ScaleBackgroundProps {
  children: React.ReactNode;
  className?: string;
  scaleFrom?: number;
  scaleTo?: number;
  duration?: number;
}

export const ScaleBackground = ({ 
  children, 
  className = "", 
  scaleFrom = 1.2,
  scaleTo = 1,
  duration = 1.5
}: ScaleBackgroundProps) => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    
    // We assume the first child is the image/background element we want to scale
    const target = container.current.firstElementChild; 
    
    if (!target) return;

    gsap.set(container.current, { overflow: 'hidden' });
    
    // Set initial scale
    gsap.set(target, { scale: scaleFrom });

    ScrollTrigger.create({
      trigger: container.current,
      start: 'top 80%', // Start animation when top of container enters 80% of viewport
      onEnter: () => {
        gsap.to(target, {
          scale: scaleTo,
          duration: duration,
          ease: 'power2.out',
        });
      },
       // Play once logic
      toggleActions: "play none none none"
    });

  }, { scope: container });

  return (
    <div ref={container} className={`relative overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

