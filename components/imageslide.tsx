'use client';

import React, {useState, useEffect} from 'react';

const images = [
    '/images/vol5.jpg',
    '/images/vol6.jpg',
    '/images/vol7.jpg',
    '/images/vol8.jpg',
    '/images/updatedlogo.png'
  ]


  export default function ImageSlide() {
    
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
    <div className="absolute inset-0 flex items-center justify-center">
        <img
        src={images[currentImageIndex]}
        alt="carousel"
        className=" object-cover transition-opacity duration-1000"
        style={{ width: '90%', height: '90%', objectFit: 'contain', opacity: 1.0 }}
        />
    </div>
    );
  }