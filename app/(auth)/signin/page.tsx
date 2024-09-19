import React from 'react';
// import Image from 'next/image';
// import { auth } from '@/lib/auth';
// import { redirect } from 'next/navigation';
import SignInForm from './SignInForm';

export default async function SignIn() {
  // const session = await auth();

  // if (session?.user) {
  //   redirect('/');
  // }

  return (
    <main className="flex h-[89vh]">
      <div className="max-w-1170 w-full mx-auto flex h-full">
        <div className="flex-[1] bg-white flex flex-col justify-center border-r border-outline">
          <div className="flex-[8] flex items-center justify-center">
            <SignInForm />
          </div>
        </div>
        <div className="flex-[1] relative bg-orange">
        </div>
      </div>
    </main>
  );
}