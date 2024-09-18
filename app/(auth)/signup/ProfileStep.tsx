'use client';

import clsx from 'clsx';
import React from 'react';
import { useFormStore } from './FormStore';
import Link from 'next/link';
import * as Form from '@radix-ui/react-form';

export default function ProfileStep() {
  const {
    step,
    setStep,
    firstName,
    setFirstName,
    lastName,
    setLastName,
  } = useFormStore();

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setLastName(e.target.value);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreateAccount = () => {
    if (canCreateAccount()) {
      setStep(step + 1);
    }
  };

  const canCreateAccount = () => {
    return firstName !== '' && lastName !== '';
  };

  return (
    <div
      className={clsx({
        'block': step === 3,
        'hidden': step !== 3
      })}
    >
      <h1 className="text-4xl text-[#353F42] font-semibold">Let&apos;s get to know you</h1>
      <h2 className="text-lg text-[#646464] font-normal mt-3 mb-8">
        You can change these later
      </h2>
      <div className="flex flex-col gap-y-4 w-full">
        <div className="flex gap-x-2">
          <Form.Field
            name="firstName"
            className="flex flex-col gap-y-1"
          >
            <Form.Label className='flex justify-between text-sm'>
              <span>First Name</span>
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Mark"
              value={firstName}
              onChange={handleFirstNameChange}
              className={clsx(
                'border border-[#C5C9D6]',
                'placeholder-[#7C7C7C]',
                'text-[#2A2D31]',
                'py-3 px-4 rounded-md',
                'outline-none focus:outline-none w-full'
              )}
            />
          </Form.Field>
          <Form.Field
            name="lastName"
            className="flex flex-col gap-y-1"
          >
            <Form.Label className='flex justify-between text-sm'>
              <span>Last Name</span>
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="Zuckerberg"
              value={lastName}
              onChange={handleLastNameChange}
              className={clsx(
                'border border-[#C5C9D6]',
                'placeholder-[#7C7C7C]',
                'text-[#2A2D31]',
                'py-3 px-4 rounded-md',
                'outline-none focus:outline-none w-full'
              )}
            />
          </Form.Field>
        </div>

        <div className="flex gap-x-4 w-full mt-2">
          <button
            type="button"
            className={clsx(
              'flex-[3]',
              'text-gray-950 border-[1.3px] border-outline',
              'rounded-lg py-2 outline-none',
            )}
            onClick={handleBack}
          >
            Go back
          </button>
          <button
            type="button"
            className={clsx(
              'flex-[5]',
              'text-white border-[1.5px] border-b-4',
              'rounded-lg py-2 outline-none',
              {
                'bg-orange border-darkorange-border cursor-pointer hover:bg-orange-button-hover': canCreateAccount(),
                'bg-orange border-darkorange-border cursor-not-allowed': !canCreateAccount(),
              }
            )}
            disabled={!canCreateAccount()}
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>
        <h3 className="text-xs text-[#646464] font-normal mt-2 mb-8">
          Already have an account? {' '}
          <Link
            href="/signin"
            className="text-orange"
          >
            Sign in
          </Link>
        </h3>
      </div>
    </div>
  );
}