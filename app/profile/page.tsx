"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Profile from "./Profile";
import { useAuth } from "@/components/auth/AuthContext";

export default function Settings() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push('/signin');
    }
  }, [session, router]);

  if (!session) {
    return;
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