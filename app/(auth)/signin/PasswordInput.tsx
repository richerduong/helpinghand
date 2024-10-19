'use client';

import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { useFormStore } from './FormStore';

interface PasswordInputProps {
  isError: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function PasswordInput({ isError, onChange, onKeyDown }: PasswordInputProps) {
  const { password, setPassword, error } = useFormStore();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (onChange) onChange(e);
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
        onKeyDown={onKeyDown}
        className={clsx(
          'border',
          'placeholder-[#7C7C7C]',
          'text-gray-950',
          'py-3 pl-4 pr-10 rounded-md',
          'outline-none focus:outline-none w-full',
          {
            'border-outline':  !isError,
            'border-danger-500':  isError,
          }
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
