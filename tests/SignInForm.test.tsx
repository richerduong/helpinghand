import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInForm from '@/app/(auth)/signin/SignInForm';
import { useFormStore } from '@/app/(auth)/signin/FormStore';
import { useAuth } from '@/components/auth/AuthContext';
import supabase from '@/api/supabaseClient';
import '@testing-library/jest-dom';

jest.mock('@/app/(auth)/signin/FormStore');
jest.mock('@/components/auth/AuthContext');
jest.mock('@/api/supabaseClient', () => ({
  auth: {
    signInWithPassword: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('SignInForm', () => {
  const setEmailMock = jest.fn();
  const setPasswordMock = jest.fn();
  const setErrorMock = jest.fn();
  const resetMock = jest.fn();
  const setSessionMock = jest.fn();

  (useFormStore as unknown as jest.Mock).mockReturnValue({
    email: '',
    password: '',
    error: '',
    setEmail: setEmailMock,
    setPassword: setPasswordMock,
    setError: setErrorMock,
    reset: resetMock,
  });

  (useAuth as jest.Mock).mockReturnValue({
    setSession: setSessionMock,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the SignInForm', () => {
    render(<SignInForm />);
    expect(screen.getByText(/Welcome to HelpingHand/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles email input change', () => {
    render(<SignInForm />);
    const emailInput = screen.getByPlaceholderText(/Email address/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(setEmailMock).toHaveBeenCalledWith('test@example.com');
  });

  test('handles password input change', () => {
    render(<SignInForm />);
    const passwordInput = screen.getByPlaceholderText('********');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(setPasswordMock).toHaveBeenCalledWith('password123');
  });

  test('displays an error for invalid email', async () => {
    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(setErrorMock).toHaveBeenCalledWith('Please enter a valid email address, like user@example.com.');
      expect(setErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  test('calls signIn function on valid input', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { session: {} },
      error: null,
    });

    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(setSessionMock).toHaveBeenCalled();
      
    });
  });

  test('handles sign-in error', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(<SignInForm />);

    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('********'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(setErrorMock).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
