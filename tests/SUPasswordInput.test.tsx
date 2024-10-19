import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordInput from '@/app/(auth)/signup/PasswordInput';
import { useFormStore } from '@/app/(auth)/signup/FormStore';
import * as Form from '@radix-ui/react-form';

jest.mock('@/app/(auth)/signup/FormStore', () => ({
  useFormStore: jest.fn(),
}));

describe('PasswordInput Component', () => {
  const setPasswordMock = jest.fn();
  const mockPassword = '';

  beforeEach(() => {
    (useFormStore as unknown as jest.Mock).mockReturnValue({
      password: mockPassword,
      setPassword: setPasswordMock,
    });
  });

  it('renders the password input with placeholder and hidden password by default', () => {
    render(
      <Form.Root>
        <Form.Field>
          <PasswordInput />
        </Form.Field>
      </Form.Root>
    );

    const passwordInput = screen.getByPlaceholderText('********');
    expect(passwordInput).toBeInTheDocument();
  });

  it('toggles password visibility when clicking the eye icon button', () => {
    render(
      <Form.Root>
        <Form.Field>
          <PasswordInput />
        </Form.Field>
      </Form.Root>
    );

    const toggleButton = screen.getByRole('button');
    const passwordInput = screen.getByPlaceholderText('********');

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('calls setPassword when the input changes', () => {
    render(
      <Form.Root>
        <Form.Field>
          <PasswordInput />
        </Form.Field>
      </Form.Root>
    );

    const passwordInput = screen.getByPlaceholderText('********');
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    expect(setPasswordMock).toHaveBeenCalledWith('newpassword');
  });
});
