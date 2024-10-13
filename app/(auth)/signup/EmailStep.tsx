'use client';

import React, { useEffect, useState } from 'react';
import { checkEmailAvailability } from '@/utils/api';
import { validateEmail } from '@/utils/validations';
import Link from 'next/link';
import * as Form from '@radix-ui/react-form';
import clsx from 'clsx';
import { useFormStore } from '@/app/(auth)/signup/FormStore';
import Image from 'next/image';

export default function EmailStep() {
  const { step, setStep, email, setEmail } = useFormStore();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl && email !== emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsAvailable(true);
    setError('');
  };

  const handleContinue = async () => {
    if (!isValidEmail()) return;

    setIsLoading(true);
    try {
      const { available } = await checkEmailAvailability();

      setIsAvailable(available);
      if (!available) {
        setError('This email is already taken.');
      } else {
        setError('');
        setStep(step + 1);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = () => {
    return validateEmail(email);
  };

  const canContinue = () => {
    return isValidEmail() && isAvailable;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canContinue()) {
      handleContinue();
    }
  };

  return (
    <div
      className={clsx({
        block: step === 1,
        hidden: step !== 1,
      })}
    >
      <h1 className="text-3xl text-[#353F42] font-semibold">Create an account</h1>
      <h2 className="text-lg text-[#646464] font-normal mt-3 mb-8">
        Already have an account?{' '}
        <Link href="/signin" className="text-orange">
          Sign in
        </Link>
      </h2>
      <div className="w-full">
        <Form.Field name="email">
          <Form.Control
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyDown}
            className={clsx(
              'border border-[#C0C3C4]',
              'placeholder-[#7C7C7C]',
              'text-[#2A2D31]',
              'py-3 px-4 rounded-lg',
              'outline-none focus:outline-none w-full'
            )}
          />
        </Form.Field>
        <span
          className={clsx('text-sm text-[#FF2E47]', {
            block: !isAvailable,
            hidden: isAvailable,
          })}
        >
          {error}
        </span>
        <button
          type="button"
          className={clsx(
            'text-white border-[1.5px] border-b-4',
            'rounded-lg py-2 mt-3 w-full outline-none',
            {
              'bg-orange border-darkorange-border cursor-pointer hover:bg-orange-button-hover': canContinue(),
              'bg-orange border-darkorange-border cursor-not-allowed': !canContinue(),
            }
          )}
          disabled={!canContinue()}
          onClick={handleContinue}
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
    </div>
  );
}
