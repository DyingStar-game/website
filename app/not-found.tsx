'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

export default function NotFound() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a delay
    setTimeout(() => setShowContent(true), 500);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Navigation />
      
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showContent && (
          <div className="text-center animate-fade-in flex items-center justify-between w-full max-w-6xl px-8">
            {/* Left side - Text */}
            <div className="flex-1 text-left">
              <h1 className="text-8xl md:text-9xl font-bold mb-6 tracking-wider font-poppins">
                <span className="text-white glowing-text-3d">
                  404
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white font-poppins tracking-wide">
                You&apos;re lost in space
              </h2>
            </div>

            {/* Right side - Astronaut */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Astronaut image */}
                <Image
                  src="/Astronaut.png"
                  alt="Space scene with planet"
                  width={384}
                  height={384}
                  className="h-80 w-80 animate-float object-contain md:h-96 md:w-96"
                  priority
                />
                
                {/* Floating particles around astronaut */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}