//fails
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Match from '@/app/events/matching/Match';
import supabase from '@/api/supabaseClient';
import { profile, event } from '@/types/types';
import '@testing-library/jest-dom';

jest.mock('@/api/supabaseClient', () => ({
  from: jest.fn().mockImplementation(() => ({
    select: jest.fn().mockImplementation(() => ({
      eq: jest.fn(),
    })),
  })),
}));

describe('Match Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading message initially', () => {
    render(<Match />);
    expect(screen.getByText(/Loading volunteers and events.../i)).toBeInTheDocument();
  });

  it('renders volunteers and matched events', async () => {
    const mockVolunteers: profile[] = [
      { email: 'volunteer1@example.com', full_name: 'Volunteer One', preferences: 'Weekends', skills: ['skill1'] },
    ];
    const mockEvents: event[] = [
      { event_name: 'Event One', required_skills: ['skill1'] },
    ];

    (supabase.from as jest.Mock)
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: mockVolunteers, error: null }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: mockEvents, error: null }),
        }),
      });

    render(<Match />);

    await waitFor(() => {
      expect(screen.getByText(/Volunteer Matching/i)).toBeInTheDocument();
      expect(screen.getByText(/Volunteer One/i)).toBeInTheDocument();
      expect(screen.getByText(/Matched Event: Event One/i)).toBeInTheDocument();
    });
  });

  it('renders volunteers with no matching events', async () => {
    const mockVolunteers: profile[] = [
      { email: 'volunteer2@example.com', full_name: 'Volunteer Two', preferences: 'Weekdays', skills: ['skill3'] },
    ];
    const mockEvents: event[] = [
      { event_name: 'Event One', required_skills: ['skill1'] },
    ];

    (supabase.from as jest.Mock)
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: mockVolunteers, error: null }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: mockEvents, error: null }),
        }),
      });

    render(<Match />);

    await waitFor(() => {
      expect(screen.getByText(/Volunteer Two/i)).toBeInTheDocument();
      expect(screen.getByText(/No Matching Event/i)).toBeInTheDocument();
    });
  });

  it('logs an error if fetching data fails', async () => {
    console.error = jest.fn();

    (supabase.from as jest.Mock)
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Fetch error') }),
        }),
      })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Fetch error') }),
        }),
      });

    render(<Match />);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
    });
  });
});
