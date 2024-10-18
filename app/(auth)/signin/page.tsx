'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "./SignInForm";
import ImageSlide from '@/components/imageslide';
import supabase from "@/api/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function SignIn() {
  // const [session, setSession] = useState<Session | null>(null);
  // const router = useRouter();

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();

  //     if (session?.user) {
  //       router.push('/profile');
  //     } else {
  //       setSession(session);
  //     }
  //   };

  //   checkSession();
  // }, [router]);

  return (
    <main className="flex h-[89vh] w-screen">
      <div className="w-full flex h-full">
        <div className="flex-[1] bg-white flex flex-col justify-center border-r border-outline h-full">
          <div className="flex-[8] flex items-center justify-center">
            <SignInForm />
          </div>
        </div>
        <div className="flex-[1] relative bg-orange h-full">
          <ImageSlide />
        </div>
      </div>
    </main>
  );
}