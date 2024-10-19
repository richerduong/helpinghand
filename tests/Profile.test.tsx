//fails
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '@/app/profile/Profile';
import { fetchUserProfile } from '@/app/profile/actions';
import supabase from '@/api/supabaseClient';
import '@testing-library/jest-dom';

jest.mock('@/app/profile/actions');
jest.mock('@/api/supabaseClient', () => ({
  from: jest.fn(() => ({
    update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) }),
  })),
}));


const mockSession = {
  user: {
    email: 'test@example.com',
  },
};

const mockProfileData = {
  email: 'test@example.com',
  full_name: 'Test User',
  address_1: '123 Test St',
  address_2: 'Apt 1',
  city: 'Testville',
  state: 'TX',
  zip_code: '12345',
  skills: ['skill1', 'skill2'],
  preferences: 'No preferences',
  availability: ['2024-01-01'],
  is_admin: false,
};

describe('Profile Component', () => {
  beforeEach(() => {
    fetchUserProfile.mockResolvedValue(mockProfileData);
    supabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) }),
    });
  });

  it('renders the Profile component and loads profile data', async () => {
    render(<Profile session={mockSession} />);

    expect(screen.getByText('Profile')).toBeInTheDocument();

    await waitFor(() => expect(fetchUserProfile).toHaveBeenCalledWith('test@example.com'));

    expect(screen.getByPlaceholderText('Full Name')).toHaveValue('Test User');
    expect(screen.getByPlaceholderText('Address 1')).toHaveValue('123 Test St');
    expect(screen.getByPlaceholderText('City')).toHaveValue('Testville');
    expect(screen.getByPlaceholderText('Zip Code')).toHaveValue('12345');
    expect(screen.getByText('TX')).toBeInTheDocument();
  });

  it('validates form fields on submit', async () => {
    render(<Profile session={mockSession} />);

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => {
      expect(screen.getByText('Full Name must not exceed 50 characters.')).toBeInTheDocument();
      expect(screen.getByText('At least one skill is required.')).toBeInTheDocument();
    });
  });

  it('submits profile data successfully', async () => {
    render(<Profile session={mockSession} />);

    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() =>
      expect(supabase.from('profiles').update).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'Test User',
          address_1: '123 Test St',
          address_2: 'Apt 1',
          city: 'Testville',
          state: 'TX',
          zip_code: '12345',
          skills: ['skill1', 'skill2'],
          availability: expect.any(Array),
        })
      )
    );

    await waitFor(() => expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument());
  });

  it('handles profile update errors', async () => {
    supabase.from.mockReturnValue({
      update: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: 'Update failed' }) }),
    });

    render(<Profile session={mockSession} />);

    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => expect(screen.getByText('Error updating profile. Please try again later.')).toBeInTheDocument());
  });
});
