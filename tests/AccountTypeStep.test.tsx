//fails
import React from 'react';
import { act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountTypeStep from '@/app/(auth)/signup/AccountTypeStep';
import { useFormStore } from '@/app/(auth)/signup/FormStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import supabase from '@/api/supabaseClient';


jest.mock('@/app/(auth)/signup/FormStore');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('@/api/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn(),
  })),
}));

describe('AccountTypeStep', () => {
  const mockSetStep = jest.fn();
  const mockSetSession = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useFormStore as unknown as jest.Mock).mockReturnValue({
      step: 3,
      setStep: mockSetStep,
      email: 'test@example.com',
      password: 'password123',
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAuth as jest.Mock).mockReturnValue({
      setSession: mockSetSession,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the account type options and "Continue" button', () => {
    render(<AccountTypeStep />);

    expect(screen.getByText("Who are you?")).toBeInTheDocument();
    expect(screen.getByText("I\'m a Volunteer or Employee")).toBeInTheDocument();
    expect(screen.getByText("I\'m an Admin of an Organization")).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('allows the user to select account type', async () => {
    render(<AccountTypeStep />);

    fireEvent.click(screen.getByText("I’m an Admin of an Organization"));

    const adminOption = screen.getByText("I'm an Admin of an Organization").closest('div');
    await waitFor(() => {
        expect(adminOption).toHaveClass('border-orange');
    });

    fireEvent.click(screen.getByText("I’m a Volunteer or Employee"));

    const volunteerOption = screen.getByText("I’m a Volunteer or Employee").closest('div');
    await waitFor(() => {
        expect(volunteerOption).toHaveClass('border-orange');
    });
});

it('shows loading spinner and calls handleContinue on clicking "Continue"', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { session: 'session_data' },
        error: null,
    });
    (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
    });

    render(<AccountTypeStep />);

    const continueButton = screen.getByRole('button', { name: /continue/i });

    await act(async () => {
        fireEvent.click(continueButton);
    });

    expect(screen.getByAltText('loading')).toBeInTheDocument();

    await waitFor(() => {
        expect(continueButton).toBeDisabled();
    });


    await waitFor(() => expect(mockSetSession).toHaveBeenCalled());
    expect(mockPush).toHaveBeenCalledWith('/profile');
});


  it('displays an error if signUp fails', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: 'Sign up error' },
    });

    render(<AccountTypeStep />);


    await act(async () => {
        fireEvent.click(screen.getByText('Continue'));
      });


    await waitFor(() => expect(screen.getByText('Sign up error')).toBeInTheDocument());
  });

  it('displays a profile insert error if profile creation fails', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { session: 'session_data' },
      error: null,
    });
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        error: { message: 'Profile creation error' },
      }),
    });

    render(<AccountTypeStep />);

    await act(async () => {
    fireEvent.click(screen.getByText('Continue'));
    });

    await waitFor(() => expect(screen.getByText('Profile creation error')).toBeInTheDocument());
  });
});
