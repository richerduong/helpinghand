import React from "react";
// import Image from 'next/image';
// import { auth } from '@/lib/auth';
// import { redirect } from 'next/navigation';
import SignUpForm from "./SignUpForm";
import ImageSlide from '@/components/imageslide'

export default async function SignIn() {
  // const session = await auth();

  // if (session?.user) {
  //   redirect('/');
  // }

  return (
    <main className="flex h-[89vh] w-screen">
      <div className="w-full flex h-full">
        <div className="flex-[1] bg-white flex flex-col justify-center border-r border-outline h-full">
          <div className="flex-[8] flex items-center justify-center">
            <SignUpForm />
          </div>
        </div>
        <div className="flex-[1] relative bg-orange h-full">
          <ImageSlide/>
        </div>
      </div>
    </main>
  );
}
