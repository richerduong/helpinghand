'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-row items-center justify-center w-screen h-[85vh]">
      <div className="flex flex-col justify-center items-center lg:mt-0 px-8 lg:px-0">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl xxl:text-8xl font-bold font-Metropolis mt-0 text-black-text text-center">
          Welcome to<br className="hidden lg:block"></br>HelpingHand
        </h1>
        <h3 className="text-darkgrey-text lg:text-2xl xxl:text-3xl mt-8 w-3/4 lg:w-2/3 text-center">
          Join our community of dedicated volunteers and start <br className="hidden lg:block"></br>making an impact. Explore events, manage your profile, and stay updated with the latest opportunities.
        </h3>
        <div className="hidden lg:block">
          <div className="flex flex-row pt-12 gap-6">
            <Link
              href={'/signin'}
              className="border-4 border-darkorange-border bg-orange border-b-6 hover:bg-orange-button-hover text-white rounded-xl px-16 py-4 font-medium text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
