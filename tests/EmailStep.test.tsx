import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from '@radix-ui/react-form';
import EmailStep from '@/app/(auth)/signup/EmailStep'; 
import { useFormStore } from '@/app/(auth)/signup/FormStore'; 
import { checkEmailAvailability } from '@/utils/api';
import '@testing-library/jest-dom';
import * as validations from '@/utils/validations';

jest.mock('@/utils/api', () => ({
  checkEmailAvailability: jest.fn(),
}));

jest.mock('@/utils/validations', () => ({
  validateEmail: jest.fn(),
}));

const mockSetEmail = jest.fn();
const mockSetStep = jest.fn();
const mockUseFormStore = {
  step: 1,
  setStep: mockSetStep,
  email: '',
  setEmail: mockSetEmail,
};

jest.mock('@/app/(auth)/signup/FormStore', () => ({
  useFormStore: jest.fn(() => mockUseFormStore),
}));

describe('EmailStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (validations.validateEmail as jest.Mock).mockReturnValue(true);
    (checkEmailAvailability as jest.Mock).mockResolvedValue({ available: true });
  });

  const renderWithForm = () => {
    return render(
      <Form>
        <EmailStep />
      </Form>
    );
  };

  test('renders correctly', () => {
    renderWithForm();
    expect(screen.getByText(/Create an account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
  });

  test('validates email input and calls setEmail', () => {
    renderWithForm();
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });

  test('shows error when email is taken', async () => {
    (checkEmailAvailability as jest.Mock).mockResolvedValueOnce({ available: false });
    renderWithForm();
    
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: 'taken@example.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(screen.getByText(/This email is already taken/i)).toBeInTheDocument();
    });
  });

  test('proceeds to the next step when email is valid and available', async () => {
    renderWithForm();
    
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await waitFor(() => {
      expect(mockSetStep).toHaveBeenCalledWith(2);
    });
  });

  test('displays loading spinner when checking availability', async () => {
    (checkEmailAvailability as jest.Mock).mockResolvedValueOnce({ available: true });
    renderWithForm();
    
    const emailInput = screen.getByPlaceholderText(/Email address/i);
    fireEvent.change(emailInput, { target: { value: 'loading@example.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument();
  });
});
