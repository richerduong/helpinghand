'use client';

import React, { useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';
import PasswordInput from './PasswordInput';
import { validateEmail } from '@/utils/validations';
import { useFormStore } from './FormStore';
// import { checkEmailAvailability, SignIn } from '@/lib/actions';

export default function SignInForm() {
  const {
    email,
    password,
    error,
    setEmail,
    setError,
    reset
  } = useFormStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailError, setIsEmailError] = useState<boolean>(true);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setEmail(e.target.value);
  };

  const handleSignIn = async () => {
    setIsLoading(true);

    setIsEmailError(true);
    if (!validateEmail(email)) {
      setError('Please enter a valid email address, like user@example.com.');
      setIsLoading(false);
      return;
    }

    // try {
    //   const { available } = await checkEmailAvailability(email)

    //   if (available) {
    //     setError('There was no account found for this email, please try again.');
    //     setIsEmailError(true);
    //     setIsLoading(false);
    //     return;
    //   }

    //   setError('');
    // } catch (error) {
    //   setError('An error occurred. Please try again later.');
    //   setIsEmailError(true);
    //   setIsLoading(false);
    //   return;
    // }

    // setIsEmailError(false);
    // try {
    //   await SignIn({ email, password })
    // } catch (error) {
    //   setError('Invalid password, please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  }

  const canSignIn = () => {
    return email !== '' && password !== '';
  };

  return (
    <Form.Root className="flex flex-col items-center text-center w-full max-w-sm">
      <h1 className="text-3xl text-black-text font-semibold">Welcome to HelpingHand</h1>
      <h2 className="text-lg text-darkgrey-text font-normal mt-3 mb-8">
        Don&apos;t have an account? {' '}
        <Link
          href="/signup"
          className="text-primary"
        >
          Sign up
        </Link>
      </h2>
      <div className="flex flex-col gap-y-3 w-full">
        <Form.Field
          name="email"
        >
          <Form.Control
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            className={clsx(
              'border',
              'placeholder-[#7C7C7C]',
              'text-gray-950',
              'py-3 px-4 rounded-lg',
              'outline-none focus:outline-none w-full',
              {
                'border-outline': !error || !isEmailError,
                'border-danger-500': error && isEmailError,
              }
            )}
          />
        </Form.Field>
        <Form.Field
          name="password"
        >
          <PasswordInput isError={!isEmailError} />
        </Form.Field>
        <span
          className={clsx(
            'text-left text-sm text-danger-500',
            {
              'block': error,
              'hidden': !error,
            }
          )}
        >
          {error}
        </span>
        <button
          type="button"
          className={clsx(
            'text-white border-[1.5px] border-b-4',
            'rounded-lg py-2 mt-1 w-full outline-none',
            {
              'bg-primary border-[#1A7BB2] cursor-pointer': canSignIn(),
              'hover:border-[1.5px] hover:transition-all duration-300 ease-in-out': canSignIn(),
              'bg-orange border-darkorange-border cursor-not-allowed hover:bg-orange-button-hover': !canSignIn(),
            }
          )}
          disabled={!canSignIn()}
          onClick={handleSignIn}
        >
          <div className="h-6 flex justify-center items-center text-center">
            <Image
              src="/auth-loading.png"
              alt="loading"
              width={24}
              height={24}
              className={clsx(
                'animate-spin direction-reverse',
                {
                  'hidden': !isLoading,
                  'block': isLoading
                }
              )}
            />
            <span
              className={clsx(
                {
                  'hidden': isLoading,
                  'block': !isLoading
                }
              )}
            >
              Sign in
            </span>
          </div>
        </button>
      </div>
      {/* <Link href="/reset" className="text-primary mt-3">
        Forgot password?
      </Link> */}
    </Form.Root>
  );
}