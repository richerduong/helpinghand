import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFormStore } from '@/app/(auth)/signin/FormStore';
import PasswordInput from '@/app/(auth)/signin/PasswordInput';
import * as Form from '@radix-ui/react-form';
import '@testing-library/jest-dom';

jest.mock('@/app/(auth)/signin/FormStore', () => ({
  useFormStore: jest.fn(),
}));

describe('PasswordInput', () => {
  const setPasswordMock = jest.fn();
  const mockPassword = 'mockPassword';
  const mockError = false;

  beforeEach(() => {
    (useFormStore as unknown as jest.Mock).mockReturnValue({
      password: mockPassword,
      setPassword: setPasswordMock,
      error: mockError,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (props = {}) => {
    return render(
      <Form.Root>
        <Form.Field>
          <PasswordInput isError={false} {...props} />
        </Form.Field>
      </Form.Root>
    );
  };

  it('renders the password input correctly', () => {
    renderWithContext();

    const inputElement = screen.getByPlaceholderText('********');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility', () => {
    renderWithContext();

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(screen.getByPlaceholderText('********')).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(screen.getByPlaceholderText('********')).toHaveAttribute('type', 'password');
  });

  it('calls setPassword on password change', () => {
    renderWithContext();
    
    const inputElement = screen.getByPlaceholderText('********');
    fireEvent.change(inputElement, { target: { value: 'newPassword' } });

    expect(setPasswordMock).toHaveBeenCalledWith('newPassword');
  });

  it('applies error styles when isError is true', () => {
    renderWithContext({ isError: true });

    const inputElement = screen.getByPlaceholderText('********');
    expect(inputElement).toHaveClass('border-danger-500');
  });

  it('does not apply error styles when isError is false', () => {
    renderWithContext({ isError: false });

    const inputElement = screen.getByPlaceholderText('********');
    expect(inputElement).toHaveClass('border-outline');
  });
});
