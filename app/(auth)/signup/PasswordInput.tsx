'use client';

import { useFormStore } from '@/app/(auth)/signup/FormStore';
import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import clsx from 'clsx';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

export default function PasswordInput() {
  const { password, setPassword } = useFormStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Form.Control
        type={showPassword ? 'text' : 'password'}
        required
        placeholder="********"
        value={password}
        onChange={handlePasswordChange}
        className={clsx(
          'border border-[#C5C9D6]',
          'placeholder-[#7C7C7C]',
          'text-[#2A2D31]',
          'py-3 pl-4 pr-10 rounded-md',
          'outline-none focus:outline-none w-full',
        )}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        {showPassword ? (
          <EyeOpenIcon className="h-5 w-5 text-gray-500"/>
        ) : (
          <EyeClosedIcon className="h-5 w-5 text-gray-500"/>
        )}
      </button>
    </div>
  );
}