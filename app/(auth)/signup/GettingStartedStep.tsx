'use client';

import clsx from 'clsx';
import React, { useState } from 'react';
import { useFormStore } from './FormStore';
import Link from 'next/link';
import * as Form from '@radix-ui/react-form';
import { checkEmailAvailability } from '@/utils/api';
import { validateEmail } from '@/utils/validations';
import Image from 'next/image';
import PasswordInput from './PasswordInput';
import PasswordRequirements from './PasswordRequirements';
import { useRouter } from 'next/navigation';

const validatePassword = (password: string): boolean => {
  const minLength = /.{8,}/;
  const hasUppercase = /[A-Z]/;
  const hasLowercase = /[a-z]/;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    minLength.test(password) &&
    hasUppercase.test(password) &&
    hasLowercase.test(password) &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password)
  );
};


export default function GettingStartedStep() {
  const {
    step,
    email,
    setEmail,
    password
  } = useFormStore();
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setEmail(e.target.value);
  };

  const handleContinue = async () => {
    setIsLoading(true);

    const { available: availableEmail } = await checkEmailAvailability()

    setIsEmailAvailable(availableEmail);

    if (availableEmail) {
      router.push('/profile');
    }

    setIsLoading(false);
  };

  const canContinue = () => {
    return validateEmail(email) && validatePassword(password);
  };

  return (
    <div
      className={clsx({
        'block': step === 2,
        'hidden': step !== 2
      })}
    >
      <h1 className="text-4xl text-[#353F42] font-semibold">Getting started</h1>
      <h2 className="text-lg text-[#646464] font-normal mt-3 mb-8">
        Already have an account? {' '}
        <Link
          href="/signin"
          className="text-orange"
        >
          Sign in
        </Link>
      </h2>
      <div className="flex flex-col gap-y-4 w-full">
        <Form.Field
          name="email"
          className="flex flex-col gap-y-1"
        >
          <Form.Label className='flex justify-between text-sm'>
            <span>Email Address</span>
            <span
              className={clsx(
                'text-danger-500',
                {
                  'hidden': isEmailAvailable,
                  'block': !isEmailAvailable
                }
              )}
            >
              Email is not available.
            </span>
          </Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="markzuck@gmail.com"
            value={email}
            onChange={handleEmailChange}
            className={clsx(
              'border border-[#C5C9D6]',
              'placeholder-[#7C7C7C]',
              'text-[#2A2D31]',
              'py-3 px-4 rounded-md',
              'outline-none focus:outline-none w-full'
            )}
          />
        </Form.Field>
        {/* <Form.Field
          name="username"
          className="flex flex-col gap-y-1"
        >
          <Form.Label className='flex justify-between text-sm'>
            <span>Username</span>
            <span
              className={clsx(
                'text-danger-500',
                {
                  'hidden': isUsernameAvailable,
                  'block': !isUsernameAvailable
                }
              )}
            >
              Username is not available.
            </span>
          </Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="markzuck"
            value={username}
            onChange={handleUsernameChange}
            className={clsx(
              'border border-[#C5C9D6]',
              'placeholder-[#7C7C7C]',
              'text-[#2A2D31]',
              'py-3 px-4 rounded-md',
              'outline-none focus:outline-none w-full'
            )}
          />
        </Form.Field> */}
        <Form.Field
          name="password"
          className="flex flex-col gap-y-1"
        >
          <Form.Label className='flex justify-between text-sm'>
            <span>Password</span>
          </Form.Label>
          <PasswordInput />
        </Form.Field>
        <PasswordRequirements />
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
              Create Account
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}