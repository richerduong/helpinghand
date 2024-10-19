import React from 'react';
import { render } from '@testing-library/react';
import { useFormStore } from '@/app/(auth)/signup/FormStore';
import PasswordRequirements from '@/app/(auth)/signup/PasswordRequirements';
import '@testing-library/jest-dom';

jest.mock('@/app/(auth)/signup/FormStore', () => ({
  useFormStore: jest.fn(),
}));

describe('PasswordRequirements', () => {
  const mockUseFormStore = useFormStore as unknown as jest.Mock;

  beforeEach(() => {
    mockUseFormStore.mockClear();
  });

  it('should display requirements based on password length', () => {
    mockUseFormStore.mockReturnValue({ password: 'short' });
    const { getByText, container } = render(<PasswordRequirements />);

    expect(getByText('8 characters')).toBeInTheDocument();
    expect(getByText('1 uppercase')).toBeInTheDocument();
    expect(getByText('1 lowercase')).toBeInTheDocument();
    expect(getByText('1 special character')).toBeInTheDocument();
    expect(getByText('1 number')).toBeInTheDocument();

  });

  it('should show that password meets requirements', () => {
    mockUseFormStore.mockReturnValue({ password: 'Valid1!!' });
    const { getByText } = render(<PasswordRequirements />);

    expect(getByText('8 characters').parentElement).toHaveClass('bg-primary-100');
    expect(getByText('1 uppercase').parentElement).toHaveClass('bg-primary-100');
    expect(getByText('1 lowercase').parentElement).toHaveClass('bg-primary-100');
    expect(getByText('1 special character').parentElement).toHaveClass('bg-primary-100');
    expect(getByText('1 number').parentElement).toHaveClass('bg-primary-100');
  });

  it('should show which requirements are not met', () => {
    mockUseFormStore.mockReturnValue({ password: 'Short1' });
    const { getByText } = render(<PasswordRequirements />);

    expect(getByText('8 characters').parentElement).toHaveClass('bg-white');
    expect(getByText('1 uppercase').parentElement).toHaveClass('bg-primary-100');
    expect(getByText('1 lowercase').parentElement).toHaveClass('bg-primary-100');
    expect(getByText('1 special character').parentElement).toHaveClass('bg-white');
    expect(getByText('1 number').parentElement).toHaveClass('bg-primary-100');
  });
});
