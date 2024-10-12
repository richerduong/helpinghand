"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/api/supabaseClient";
import Profile from "./Profile";
import { Session } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/signin');
      } else {
        setSession(session);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (profile) {
          const requiredFields = ['full_name', 'address1', 'city', 'state', 'zip_code', 'skills', 'availability'];
          const isComplete = requiredFields.every(field => profile[field]);
          setProfileComplete(isComplete);
        }
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    if (profileComplete) {
      router.push('/'); // Redirect to home or any other page if profile is complete
    } else {
      router.push('/profile');
    }
  }, [profileComplete, router]);

  if (!session) {
    return;
  }

  return (
    <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
      <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
        <Profile session={session} setProfileComplete={setProfileComplete} />
        <hr className="border-gray-300 w-full my-4 mb-6" />
      </div>
    </div>
  );
}