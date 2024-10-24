import { fetchVolunteerHistory } from './actions';
import supabase from '@/api/supabaseClient';
import { fetchUserProfile } from '../../profile/actions';
import { VolunteerHistory } from '@/types/types';

// Mock Supabase client
jest.mock('@/api/supabaseClient', () => ({
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  })),
}));

// Mock the fetchUserProfile function
jest.mock('../../profile/actions', () => ({
  fetchUserProfile: jest.fn(),
}));

describe('fetchVolunteerHistory', () => {
  const mockVolunteerHistory: VolunteerHistory[] = [
    {
      id: 1,
      created_at: '2023-01-01',
      updated_at: '2023-01-02',
      volunteer_id: 1,
      event_id: 1,
      participation_status: 'upcoming',
      event_name: 'Test Event',
      location: 'Test Location',
      event_date: '2024-01-10',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should fetch volunteer history successfully', async () => {
    // Mock successful user retrieval
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    // Mock successful user profile retrieval
    (fetchUserProfile as jest.Mock).mockResolvedValue({ id: 1 });

    // Mock successful volunteer history retrieval
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: mockVolunteerHistory, error: null }),
    });

    // Call the function
    const result = await fetchVolunteerHistory();

    // Expectations
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(fetchUserProfile).toHaveBeenCalledWith('test@example.com');
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(result).toEqual({ history: mockVolunteerHistory, error: null });
  });

  it('should return an error if fetching user fails', async () => {
    // Mock user retrieval failure
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: null,
      error: 'User fetch error',
    });

    // Call the function
    const result = await fetchVolunteerHistory();

    // Expectations
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(result).toEqual({
      history: null,
      error: 'Error fetching user or user email is not available',
    });
  });

  it('should return an error if no user profile is found', async () => {
    // Mock successful user retrieval
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    // Mock no profile found
    (fetchUserProfile as jest.Mock).mockResolvedValue(null);

    // Call the function
    const result = await fetchVolunteerHistory();

    // Expectations
    expect(fetchUserProfile).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual({ history: null, error: 'No profile found for current user' });
  });

  it('should return an error if fetching volunteer history fails', async () => {
    // Mock successful user retrieval
    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    // Mock successful profile retrieval
    (fetchUserProfile as jest.Mock).mockResolvedValue({ id: 1 });

    // Mock volunteer history failure
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ data: null, error: { message: 'Fetch history error' } }),
    });

    // Call the function
    const result = await fetchVolunteerHistory();

    // Expectations
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(result).toEqual({
      history: null,
      error: 'Error fetching volunteer history',
    });
  });

  it('should handle unexpected errors', async () => {
    // Mock unexpected error during user retrieval
    (supabase.auth.getUser as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    // Call the function
    const result = await fetchVolunteerHistory();

    // Expectations
    expect(result).toEqual({
      history: null,
      error: 'An unexpected error occurred while fetching history',
    });
  });
});
