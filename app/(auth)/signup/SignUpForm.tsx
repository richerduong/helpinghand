'use client';

import React, { useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import EmailStep from './EmailStep';
import GettingStartedStep from './GettingStartedStep';
import AccountTypeStep from './AccountTypeStep';
import { useFormStore } from './FormStore';

export default function SignUpForm() {
  const { reset } = useFormStore();

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <Form.Root className="flex flex-col items-center text-center w-full max-w-sm">
      <EmailStep />
      <GettingStartedStep />
      <AccountTypeStep />
    </Form.Root>
  );
}