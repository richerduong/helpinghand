// fails
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GettingStartedStep from '@/app/(auth)/signup/GettingStartedStep';
import { useFormStore } from '@/app/(auth)/signup/FormStore';
import '@testing-library/jest-dom';

jest.mock('@/app/(auth)/signup/FormStore');

const mockSetStep = jest.fn();
const mockSetEmail = jest.fn();
const mockSetPassword = jest.fn();

beforeEach(() => {
  // Reset the mocks before each test
  mockSetStep.mockClear();
  mockSetEmail.mockClear();
  mockSetPassword.mockClear();
  (useFormStore as unknown as jest.Mock).mockReturnValue({
    step: 2,
    setStep: mockSetStep,
    email: '',
    setEmail: mockSetEmail,
    password: '',
    setPassword: mockSetPassword,
  });
});

test('renders GettingStartedStep and handles form submission', async () => {
  render(<GettingStartedStep />);

  expect(screen.getByText(/Getting started/i)).toBeInTheDocument();

  const emailInput = screen.getByPlaceholderText(/markzuck@gmail.com/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const continueButton = screen.getByRole('button', { name: /Continue/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'Password1!' } });

  expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');

  fireEvent.click(continueButton);


  await waitFor(() => {
    expect(mockSetStep).toHaveBeenCalledWith(3);
  });
});

test('displays error message on invalid input', async () => {
  render(<GettingStartedStep />);

  const emailInput = screen.getByPlaceholderText(/markzuck@gmail.com/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const continueButton = screen.getByRole('button', { name: /Continue/i });

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
  fireEvent.change(passwordInput, { target: { value: 'short' } });


  fireEvent.click(continueButton);

  expect(await screen.findByText(/Please provide valid email and password/i)).toBeInTheDocument();
});

test('continues loading state when submitting', async () => {
  render(<GettingStartedStep />);

  const emailInput = screen.getByPlaceholderText(/markzuck@gmail.com/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const continueButton = screen.getByRole('button', { name: /Continue/i });

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'Password1!' } });

  fireEvent.click(continueButton);

  expect(screen.getByAltText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByAltText(/loading/i)).not.toBeInTheDocument();
  });
});
