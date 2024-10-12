import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "./SignUpForm";
import ImageSlide from "@/components/imageslide";
import supabase from "@/api/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function SignUp() {
  // const [session, setSession] = useState<Session | null>(null);
  // const router = useRouter();

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const { data: { session } } = await supabase.auth.getSession();

  //     if (session?.user) {
  //       router.push('/');
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
            <SignUpForm />
          </div>
        </div>
        <div className="flex-[1] relative bg-orange h-full">
          <ImageSlide />
        </div>
      </div>
    </main>
  );
}