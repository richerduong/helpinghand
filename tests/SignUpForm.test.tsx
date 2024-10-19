import React from 'react';
import { render, screen } from '@testing-library/react';
import SignUpForm from '@/app/(auth)/signup/SignUpForm';
import { useFormStore } from '@/app/(auth)/signup/FormStore';
import '@testing-library/jest-dom';

jest.mock('@/app/(auth)/signup/FormStore', () => ({
  useFormStore: jest.fn(),
}));

jest.mock('@/app/(auth)/signup/EmailStep', () => () => <div>EmailStep</div>);
jest.mock('@/app/(auth)/signup/GettingStartedStep', () => () => <div>GettingStartedStep</div>);
jest.mock('@/app/(auth)/signup/AccountTypeStep', () => () => <div>AccountTypeStep</div>);

describe('SignUpForm', () => {
  const resetMock = jest.fn();

  beforeEach(() => {
    (useFormStore as unknown as jest.Mock).mockReturnValue({
      reset: resetMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls reset on mount', () => {
    render(<SignUpForm />);

    expect(resetMock).toHaveBeenCalled();
  });

  it('renders the form steps', () => {
    render(<SignUpForm />);

    expect(screen.getByText('EmailStep')).toBeInTheDocument();
    expect(screen.getByText('GettingStartedStep')).toBeInTheDocument();
    expect(screen.getByText('AccountTypeStep')).toBeInTheDocument();
  });
});
