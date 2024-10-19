'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { useFormStore } from './FormStore';
import supabase from '@/api/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthContext';

export default function AccountTypeStep() {
  const { step, setStep, email, password } = useFormStore();
  const [accountType, setAccountType] = useState<'volunteer' | 'admin'>('volunteer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setSession } = useAuth();

  const handleAccountTypeSelection = (type: 'volunteer' | 'admin') => {
    setAccountType(type);
  };

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              email: email,
              is_admin: accountType === 'admin',
            },
          ]);

        if (profileError) {
          setError(profileError.message);
        } else {
          setSession(signUpData.session);
          router.push('/profile');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={clsx({
        'block': step === 3,
        'hidden': step !== 3,
      })}
    >
      <h1 className="text-3xl text-[#353F42] font-semibold">Who are you?</h1>
      <h2 className="text-lg text-[#646464] font-normal mt-3 mb-8">
        You&apos;re almost signed up. Let us know who you are so we can create the right account for you.
      </h2>

      <div className="flex justify-center gap-x-4 mb-6">
        <div
          onClick={() => handleAccountTypeSelection('volunteer')}
          className={clsx(
            'border-2 rounded-lg p-4 cursor-pointer',
            accountType === 'volunteer' ? 'border-orange' : 'border-gray-300'
          )}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold">I&apos;m a Volunteer or Employee</span>
            <p className="text-sm text-gray-500">
              Ready to volunteer + give personally or with an organization
            </p>
          </div>
        </div>

        <div
          onClick={() => handleAccountTypeSelection('admin')}
          className={clsx(
            'border-2 rounded-lg p-4 cursor-pointer',
            accountType === 'admin' ? 'border-orange' : 'border-gray-300'
          )}
        >
          <div className="flex flex-col items-center">
            <span className="font-semibold">I&apos;m an Admin of an Organization</span>
            <p className="text-sm text-gray-500">
              Nonprofit, Company, School or Religious Congregation
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
          type="button"
          className={clsx(
            'text-white border-[1.5px] border-b-4',
            'rounded-lg py-2 mt-3 w-full outline-none',
            'bg-orange border-darkorange-border cursor-pointer hover:bg-orange-button-hover',
            {'cursor-not-allowed opacity 50': isLoading}
          )}
          onClick={handleContinue}
          disabled={isLoading}
        >
          <div className="h-6 flex justify-center items-center text-center">
            <Image
              src="/auth-loading.png"
              alt="loading"
              width={24}
              height={24}
              className={clsx('animate-spin direction-reverse', {
                hidden: !isLoading,
                block: isLoading,
              })}
            />
            <span
              className={clsx({
                hidden: isLoading,
                block: !isLoading,
              })}
            >
              Continue
            </span>
          </div>
        </button>
    </div>
  );
}
