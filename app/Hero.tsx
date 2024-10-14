'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import Image from 'next/image';

const images = [
  '/images/vol1.jpg',
  '/images/vol2.jpg',
  '/images/vol3.jpg',
  '/images/vol4.jpg'
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(()=> {
      setCurrentImageIndex((prevIndex)=> (prevIndex +1)% images.length);
    }, 10000);
    return () =>clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row items-center justify-center w-screen h-[85vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src={images[currentImageIndex]}
          alt="carousel"
          width={1920}
          height={1080}
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: 0.2 }}
        />
      </div>
      <div className="flex flex-col justify-center items-center lg:mt-0 px-8 lg:px-0 z-10">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl xxl:text-8xl font-bold font-Metropolis mt-0 text-black-text text-center">
          Welcome to<br className="hidden lg:block"></br>HelpingHand
        </h1>
        <h3 className="text-black-text lg:text-2xl xxl:text-3xl mt-8 w-3/4 lg:w-2/3 text-center font-bold">
          Join our community of dedicated volunteers and start <br className="hidden lg:block"></br>making an impact. Explore events, manage your profile, and stay updated with the latest opportunities.
        </h3>
        <div className="hidden lg:block">
          <div className="flex flex-row pt-12 gap-6">
            <Link
              href={'/signin'}
              className="border-4 border-darkorange-border bg-orange border-b-8 hover:bg-orange-button-hover text-white rounded-xl px-16 py-4 font-medium text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
