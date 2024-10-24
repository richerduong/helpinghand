// app/notifications/actions.test.ts

import { fetchNotifications, markNotificationAsRead } from './actions';
import supabase from '@/api/supabaseClient';

// Mock Supabase client
jest.mock('@/api/supabaseClient', () => {
  // Create separate mock functions for each table and method
  const mockProfilesSelect = jest.fn();
  const mockProfilesEq = jest.fn();
  const mockProfilesSingle = jest.fn();
  
  const mockNotificationsSelect = jest.fn();
  const mockNotificationsEq = jest.fn();
  const mockNotificationsOrder = jest.fn();
  const mockNotificationsUpdate = jest.fn();
  
  // Mock the 'from' method to return specific chainable mocks based on table
  const mockFrom = jest.fn().mockImplementation((table: string) => {
    switch (table) {
      case 'profiles':
        return {
          select: mockProfilesSelect,
          eq: mockProfilesEq,
          single: mockProfilesSingle,
        };
      case 'notifications':
        return {
          select: mockNotificationsSelect,
          eq: mockNotificationsEq,
          order: mockNotificationsOrder,
          update: mockNotificationsUpdate,
        };
      default:
        return {
          select: jest.fn(),
          eq: jest.fn(),
          single: jest.fn(),
          order: jest.fn(),
          update: jest.fn(),
        };
    }
  });
  
  return {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
    },
    __mocks__: {
      from: mockFrom,
      profilesSelect: mockProfilesSelect,
      profilesEq: mockProfilesEq,
      profilesSingle: mockProfilesSingle,
      notificationsSelect: mockNotificationsSelect,
      notificationsEq: mockNotificationsEq,
      notificationsOrder: mockNotificationsOrder,
      notificationsUpdate: mockNotificationsUpdate,
    },
  };
});

describe('fetchNotifications', () => {
  const mockNotifications = [
    {
      id: 1,
      message: 'Test Notification',
      created_at: '2024-01-10',
      event_name: 'Test Event',
      date: '2024-01-10',
      time: '10:00 AM',
      location: 'Test Location',
      description: 'This is a test notification.',
      is_read: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch notifications successfully', async () => {
    // Mock user retrieval
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    // Mock user profile retrieval
    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.profilesSelect.mockReturnThis(),
      eq: supabase.__mocks__.profilesEq.mockReturnThis(),
      single: supabase.__mocks__.profilesSingle.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      }),
    });

    // Mock notification retrieval
    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.notificationsSelect.mockReturnThis(),
      eq: supabase.__mocks__.notificationsEq.mockReturnThis(),
      order: supabase.__mocks__.notificationsOrder.mockResolvedValueOnce({
        data: mockNotifications,
        error: null,
      }),
    });

    // Call the fetchNotifications function
    const result = await fetchNotifications();

    // Expectations
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.__mocks__.profilesSelect).toHaveBeenCalledWith('id');
    expect(supabase.__mocks__.profilesEq).toHaveBeenCalledWith('email', 'test@example.com');
    expect(supabase.__mocks__.profilesSingle).toHaveBeenCalled();

    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(supabase.__mocks__.notificationsSelect).toHaveBeenCalledWith('id, message, created_at, event_name, date, time, location, description, is_read');
    expect(supabase.__mocks__.notificationsEq).toHaveBeenCalledWith('volunteer_id', 1);
    expect(supabase.__mocks__.notificationsOrder).toHaveBeenCalledWith('created_at', { ascending: false });

    expect(result).toEqual({ notifications: mockNotifications, error: null });
  });

  it('should return an empty array if no notifications are found', async () => {
    // Mock user retrieval
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    // Mock user profile retrieval
    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.profilesSelect.mockReturnThis(),
      eq: supabase.__mocks__.profilesEq.mockReturnThis(),
      single: supabase.__mocks__.profilesSingle.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      }),
    });

    // Mock notification retrieval with empty array
    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.notificationsSelect.mockReturnThis(),
      eq: supabase.__mocks__.notificationsEq.mockReturnThis(),
      order: supabase.__mocks__.notificationsOrder.mockResolvedValueOnce({
        data: [],
        error: null,
      }),
    });

    const result = await fetchNotifications();

    expect(result).toEqual({ notifications: [], error: null });
  });

  it('should return an error if user retrieval fails', async () => {
    // Mock user retrieval failure
    supabase.auth.getUser.mockResolvedValue({
      data: null,
      error: 'User fetch error',
    });

    const result = await fetchNotifications();

    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(result).toEqual({ notifications: null, error: 'Failed to get user information.' });
  });

  it('should return an error if profile retrieval fails', async () => {
    // Mock successful user retrieval
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    // Mock profile retrieval failure
    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.profilesSelect.mockReturnThis(),
      eq: supabase.__mocks__.profilesEq.mockReturnThis(),
      single: supabase.__mocks__.profilesSingle.mockResolvedValueOnce({
        data: null,
        error: 'Profile fetch error',
      }),
    });

    const result = await fetchNotifications();

    expect(result).toEqual({ notifications: null, error: 'Failed to get user profile or user ID.' });
  });

  it('should return an error if notification retrieval fails', async () => {
    // Mock successful user and profile retrieval
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.profilesSelect.mockReturnThis(),
      eq: supabase.__mocks__.profilesEq.mockReturnThis(),
      single: supabase.__mocks__.profilesSingle.mockResolvedValueOnce({
        data: { id: 1 },
        error: null,
      }),
    });

    // Mock notification retrieval failure
    supabase.from.mockReturnValueOnce({
      select: supabase.__mocks__.notificationsSelect.mockReturnThis(),
      eq: supabase.__mocks__.notificationsEq.mockReturnThis(),
      order: supabase.__mocks__.notificationsOrder.mockResolvedValueOnce({
        data: null,
        error: 'Notification fetch error',
      }),
    });

    const result = await fetchNotifications();

    expect(result).toEqual({ notifications: null, error: 'Notification fetch error' });
  });

  it('should handle unexpected errors in fetchNotifications', async () => {
    // Mock unexpected error in user retrieval
    supabase.auth.getUser.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const result = await fetchNotifications();

    expect(result).toEqual({ notifications: null, error: 'Unexpected error' });
  });
});

describe('markNotificationAsRead', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should mark a notification as read successfully', async () => {
    // Mock successful update
    supabase.from.mockReturnValueOnce({
      update: supabase.__mocks__.notificationsUpdate.mockReturnThis(),
      eq: supabase.__mocks__.notificationsEq.mockResolvedValueOnce({
        data: null,
        error: null,
      }),
    });

    const result = await markNotificationAsRead(1);

    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(supabase.__mocks__.notificationsUpdate).toHaveBeenCalledWith({ is_read: true });
    expect(supabase.__mocks__.notificationsEq).toHaveBeenCalledWith('id', 1);
    expect(result).toEqual({ success: true });
  });

  it('should return an error if marking notification as read fails', async () => {
    // Mock update failure
    supabase.from.mockReturnValueOnce({
      update: supabase.__mocks__.notificationsUpdate.mockReturnThis(),
      eq: supabase.__mocks__.notificationsEq.mockResolvedValueOnce({
        data: null,
        error: 'Update error',
      }),
    });

    const result = await markNotificationAsRead(1);

    expect(result).toEqual({ success: false, error: 'Update error' });
  });

  it('should handle unexpected errors in markNotificationAsRead', async () => {
    // Mock unexpected error in marking as read
    supabase.from.mockReturnValueOnce({
      update: supabase.__mocks__.notificationsUpdate.mockReturnThis(),
      eq: supabase.__mocks__.notificationsEq.mockImplementation(() => {
        throw new Error('Unexpected error');
      }),
    });

    const result = await markNotificationAsRead(1);

    expect(result).toEqual({ success: false, error: 'Unexpected error' });
  });
});
