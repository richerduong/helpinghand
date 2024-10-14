'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/vol5.jpg',
  '/images/vol6.jpg',
  '/images/vol7.jpg',
  '/images/vol8.jpg',
  '/images/updatedlogo.png',
];

export default function ImageSlide() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[90%] h-[90%]">
        <Image
          src={images[currentImageIndex]}
          alt="carousel"
          fill
          className="object-contain transition-opacity duration-1000"
          priority
        />
      </div>
    </div>
  );
}
