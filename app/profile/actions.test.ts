import { fetchUserProfile, updateUserProfile } from './actions';
import supabase from '@/api/supabaseClient'; // Mock supabase client

// Mock Supabase client
jest.mock('@/api/supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}));

describe('fetchUserProfile', () => {
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should return user profile when found', async () => {
    // Mock successful response from Supabase
    const mockData = { id: 1, email: mockEmail };
    
    // Properly mock the entire chain of method calls
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    // Call the function
    const result = await fetchUserProfile(mockEmail);

    // Expectations
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(result).toEqual(mockData); // Check if the result matches the mock data
  });

  it('should return null if no profile is found', async () => {
    // Mock no profile found
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    });

    // Call the function
    const result = await fetchUserProfile(mockEmail);

    // Expectations
    expect(result).toBeNull();
  });

  it('should return null if there is an error', async () => {
    // Mock error from Supabase
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: 'Some error' }),
    });

    // Call the function
    const result = await fetchUserProfile(mockEmail);

    // Expectations
    expect(result).toBeNull();
  });
});

describe('updateUserProfile', () => {
  const mockProfileInfo = {
    email: 'test@example.com',
    full_name: 'John Doe',
    address_1: '123 Main St',
    address_2: 'Apt 4B',
    city: 'Test City',
    state: 'TX',
    zip_code: '12345',
    skills: ['JavaScript', 'React'],
    preferences: ['Remote'],
    availability: [new Date()],
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('should return success when profile is updated successfully', async () => {
    // Mock successful update response from Supabase
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    // Call the function
    const result = await updateUserProfile(mockProfileInfo);

    // Expectations
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(result).toEqual({ success: true, message: 'Profile updated successfully' });
  });

  it('should return an error message if there is an error during update', async () => {
    // Mock error response from Supabase
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: 'Some error' }),
    });

    // Call the function
    const result = await updateUserProfile(mockProfileInfo);

    // Expectations
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(result).toEqual({ success: false, message: 'Error updating profile' });
  });
});