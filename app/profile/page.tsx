"use client";

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Profile from "./Profile";
import { getSession } from "@/utils/login/actions";

export default function Settings() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/signin');
      } else {
        setSession(session);
      }
    };

    fetchSession();
  }, [router]);

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-1170 w-full mx-auto flex justify-center h-full">
      <div className="bg-white border-2 border-[#C5C9D6] mt-4 rounded-2xl p-12 mb-4 w-4/5">
        <Profile session={session} />
        <hr className="border-gray-300 w-full my-4 mb-6" />
      </div>
    </div>
  );
}
