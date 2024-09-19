'use client';

import { useFormStore } from '@/app/(auth)/signup/FormStore';
import React from 'react';
import clsx from 'clsx';

export default function PasswordRequirements() {
  const { password } = useFormStore();

  const requirements = [
    { label: '8 characters', test: () => password.length >= 8 },
    { label: '1 uppercase', test: () => /[A-Z]/.test(password) },
    { label: '1 lowercase', test: () => /[a-z]/.test(password) },
    { label: '1 special character', test: () => /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: '1 number', test: () => /\d/.test(password) },
  ];

  return (
    <div className="flex flex-wrap gap-y-2 gap-x-2">
      {requirements.map((req, index) => (
        <div
          key={index}
          className={clsx(
            'flex items-center text-sm gap-x-2 rounded-full border py-1 px-2',
            {
              'bg-primary-100 border-primary-400': req.test(),
              'bg-white border-[#C0C3C4]': !req.test(),
            }
          )}
        >
          <span className="text-gray-900 text-sm">{req.label}</span>
        </div>
      ))}
    </div>
  );
}