// app/events/matching/actions.test.ts

import { fetchVolunteersAndEvents, handleManualMatch } from './actions';
import supabase from '@/api/supabaseClient';
import { profile, event } from '@/types/types';

// Mock the Supabase client
jest.mock('@/api/supabaseClient', () => {
  // Create mock functions for each method
  const mockProfilesSelect = jest.fn();
  const mockProfilesEq = jest.fn();

  const mockEventsSelect = jest.fn();

  const mockVolunteerHistorySelect = jest.fn();
  const mockVolunteerHistoryEq = jest.fn();
  const mockVolunteerHistoryEq2 = jest.fn();
  const mockVolunteerHistoryMaybeSingle = jest.fn();

  const mockVolunteerHistoryInsert = jest.fn();

  const mockNotificationsInsert = jest.fn();

  const mockFrom = jest.fn().mockImplementation((table: string) => {
    switch (table) {
      case 'profiles':
        // Chain: from('profiles').select('*').eq('is_admin', false)
        return {
          select: mockProfilesSelect.mockReturnValue({
            eq: mockProfilesEq,
          }),
        };
      case 'events':
        // Chain: from('events').select('*')
        return {
          select: mockEventsSelect,
        };
      case 'volunteer_history':
        // Chain: from('volunteer_history').select('*').eq('volunteer_id', id).eq('event_id', id).maybeSingle()
        return {
          select: mockVolunteerHistorySelect.mockReturnValue({
            eq: mockVolunteerHistoryEq.mockReturnValue({
              eq: mockVolunteerHistoryEq2.mockReturnValue({
                maybeSingle: mockVolunteerHistoryMaybeSingle,
              }),
            }),
          }),
          insert: mockVolunteerHistoryInsert,
        };
      case 'notifications':
        // Chain: from('notifications').insert([...])
        return {
          insert: mockNotificationsInsert,
        };
      default:
        return {
          select: jest.fn(),
          eq: jest.fn(),
          maybeSingle: jest.fn(),
          insert: jest.fn(),
        };
    }
  });

  return {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
    },
    // Expose mock functions for use in tests
    __mocks__: {
      from: mockFrom,
      profilesSelect: mockProfilesSelect,
      profilesEq: mockProfilesEq,
      eventsSelect: mockEventsSelect,
      volunteerHistorySelect: mockVolunteerHistorySelect,
      volunteerHistoryEq: mockVolunteerHistoryEq,
      volunteerHistoryEq2: mockVolunteerHistoryEq2,
      volunteerHistoryMaybeSingle: mockVolunteerHistoryMaybeSingle,
      volunteerHistoryInsert: mockVolunteerHistoryInsert,
      notificationsInsert: mockNotificationsInsert,
    },
  };
});

describe('fetchVolunteersAndEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch volunteers and events successfully', async () => {
    const mockVolunteers: profile[] = [{ id: 1, full_name: 'John Doe', is_admin: false }];
    const mockEvents: event[] = [{ id: 1, event_name: 'Test Event', required_skills: ['JavaScript'] }];

    // Mock 'profiles' table response: select('*').eq('is_admin', false)
    supabase.__mocks__.profilesSelect.mockImplementation(() => ({
      eq: supabase.__mocks__.profilesEq,
    }));

    supabase.__mocks__.profilesEq.mockResolvedValueOnce({
      data: mockVolunteers,
      error: null,
    });

    // Mock 'events' table response: select('*')
    supabase.__mocks__.eventsSelect.mockResolvedValueOnce({
      data: mockEvents,
      error: null,
    });

    const result = await fetchVolunteersAndEvents();

    // Assertions for 'profiles'
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.__mocks__.profilesSelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.profilesEq).toHaveBeenCalledWith('is_admin', false);

    // Assertions for 'events'
    expect(supabase.from).toHaveBeenCalledWith('events');
    expect(supabase.__mocks__.eventsSelect).toHaveBeenCalledWith('*');

    // Final Assertions
    expect(result.volunteers).toEqual(mockVolunteers);
    expect(result.events).toEqual(mockEvents);
    expect(result.error).toBeNull();
  });

  it('should return an error if fetching volunteers fails', async () => {
    // Mock 'profiles' table response: select('*').eq('is_admin', false) with error
    supabase.__mocks__.profilesSelect.mockImplementation(() => ({
      eq: supabase.__mocks__.profilesEq,
    }));

    supabase.__mocks__.profilesEq.mockResolvedValueOnce({
      data: null,
      error: { message: 'Error fetching volunteers' },
    });

    // Even if 'events' fetch fails, the error should be from volunteers
    supabase.__mocks__.eventsSelect.mockResolvedValueOnce({
      data: null,
      error: { message: 'Error fetching events' },
    });

    const result = await fetchVolunteersAndEvents();

    // Assertions for 'profiles'
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.__mocks__.profilesSelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.profilesEq).toHaveBeenCalledWith('is_admin', false);

    // Assertions for 'events' (even though error should be from 'profiles')
    expect(supabase.from).toHaveBeenCalledWith('events');
    expect(supabase.__mocks__.eventsSelect).toHaveBeenCalledWith('*');

    // Final Assertions
    expect(result.volunteers).toEqual([]);
    expect(result.events).toEqual([]);
    expect(result.error).toBe('Error fetching volunteers');
  });

  it('should return an error if fetching events fails', async () => {
    const mockVolunteers: profile[] = [{ id: 1, full_name: 'John Doe', is_admin: false }];

    // Mock 'profiles' table response: select('*').eq('is_admin', false)
    supabase.__mocks__.profilesSelect.mockImplementation(() => ({
      eq: supabase.__mocks__.profilesEq,
    }));

    supabase.__mocks__.profilesEq.mockResolvedValueOnce({
      data: mockVolunteers,
      error: null,
    });

    // Mock 'events' table response: select('*') with error
    supabase.__mocks__.eventsSelect.mockResolvedValueOnce({
      data: null,
      error: { message: 'Error fetching events' },
    });

    const result = await fetchVolunteersAndEvents();

    // Assertions for 'profiles'
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.__mocks__.profilesSelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.profilesEq).toHaveBeenCalledWith('is_admin', false);

    // Assertions for 'events'
    expect(supabase.from).toHaveBeenCalledWith('events');
    expect(supabase.__mocks__.eventsSelect).toHaveBeenCalledWith('*');

    // Final Assertions
    expect(result.volunteers).toEqual(mockVolunteers);
    expect(result.events).toEqual([]);
    expect(result.error).toBe('Error fetching events');
  });
});

describe('handleManualMatch', () => {
  const mockVolunteer: profile = { id: 1, full_name: 'John Doe', email: 'john@example.com', is_admin: false };
  const mockEvent: event = { id: 1, event_name: 'Test Event', event_description: 'Description', location: 'Location', required_skills: ['React'], urgency: 'High', event_date: new Date('2023-10-25') };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should insert a match and notification successfully', async () => {
    // Mock 'volunteer_history' select().eq().eq().maybeSingle() response: no existing match
    supabase.__mocks__.volunteerHistorySelect.mockImplementation(() => ({
      eq: supabase.__mocks__.volunteerHistoryEq,
    }));

    supabase.__mocks__.volunteerHistoryEq.mockImplementation((field: string, value: any) => {
      if (field === 'volunteer_id') {
        return {
          eq: supabase.__mocks__.volunteerHistoryEq2,
        };
      }
      return {
        maybeSingle: supabase.__mocks__.volunteerHistoryMaybeSingle,
      };
    });

    supabase.__mocks__.volunteerHistoryEq2.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    supabase.__mocks__.volunteerHistoryMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    // Mock 'volunteer_history' insert response: success
    supabase.__mocks__.volunteerHistoryInsert.mockResolvedValueOnce({
      error: null,
    });

    // Mock 'notifications' insert response: success
    supabase.__mocks__.notificationsInsert.mockResolvedValueOnce({
      error: null,
    });

    const result = await handleManualMatch(mockVolunteer, mockEvent);

    // Assertions for 'volunteer_history' select
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistorySelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.volunteerHistoryEq).toHaveBeenCalledWith('volunteer_id', mockVolunteer.id);
    expect(supabase.__mocks__.volunteerHistoryEq2).toHaveBeenCalledWith('event_id', mockEvent.id);
    expect(supabase.__mocks__.volunteerHistoryMaybeSingle).toHaveBeenCalled();

    // Assertions for 'volunteer_history' insert
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistoryInsert).toHaveBeenCalledWith([{
      volunteer_id: mockVolunteer.id,
      event_id: mockEvent.id,
      participation_status: 'upcoming',
      event_name: mockEvent.event_name,
      location: mockEvent.location,
      event_date: mockEvent.event_date,
    }]);

    // Assertions for 'notifications' insert
    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(supabase.__mocks__.notificationsInsert).toHaveBeenCalledWith([{
      volunteer_id: mockVolunteer.id,
      message: `You have been matched to the event: ${mockEvent.event_name}`,
      event_name: mockEvent.event_name,
      date: mockEvent.event_date,
      time: expect.any(String),
      location: mockEvent.location,
      is_read: false,
      created_at: expect.any(Date),
      description: `You are now scheduled to attend the event "${mockEvent.event_name}" at ${mockEvent.location}.`,
    }]);

    // Final Assertions
    expect(result.success).toBe(true);
    expect(result.message).toBe(`Volunteer John Doe successfully matched to event Test Event`);
  });

  it('should return an error if the volunteer is already matched', async () => {
    // Mock 'volunteer_history' select().eq().eq().maybeSingle() response: existing match
    supabase.__mocks__.volunteerHistorySelect.mockImplementation(() => ({
      eq: supabase.__mocks__.volunteerHistoryEq,
    }));

    supabase.__mocks__.volunteerHistoryEq.mockImplementation((field: string, value: any) => {
      if (field === 'volunteer_id') {
        return {
          eq: supabase.__mocks__.volunteerHistoryEq2,
        };
      }
      return {
        maybeSingle: supabase.__mocks__.volunteerHistoryMaybeSingle,
      };
    });

    supabase.__mocks__.volunteerHistoryEq2.mockResolvedValueOnce({
      data: { id: 1 }, // Existing match
      error: null,
    });

    supabase.__mocks__.volunteerHistoryMaybeSingle.mockResolvedValueOnce({
      data: { id: 1 },
      error: null,
    });

    const result = await handleManualMatch(mockVolunteer, mockEvent);

    // Assertions for 'volunteer_history' select
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistorySelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.volunteerHistoryEq).toHaveBeenCalledWith('volunteer_id', mockVolunteer.id);
    expect(supabase.__mocks__.volunteerHistoryEq2).toHaveBeenCalledWith('event_id', mockEvent.id);
    expect(supabase.__mocks__.volunteerHistoryMaybeSingle).toHaveBeenCalled();

    // No insert calls should be made
    expect(supabase.__mocks__.volunteerHistoryInsert).not.toHaveBeenCalled();
    expect(supabase.__mocks__.notificationsInsert).not.toHaveBeenCalled();

    // Final Assertions
    expect(result.success).toBe(false);
    expect(result.message).toBe('Volunteer John Doe is already matched to event Test Event.');
  });

  it('should return an error if match insertion fails', async () => {
    // Mock 'volunteer_history' select().eq().eq().maybeSingle() response: no existing match
    supabase.__mocks__.volunteerHistorySelect.mockImplementation(() => ({
      eq: supabase.__mocks__.volunteerHistoryEq,
    }));

    supabase.__mocks__.volunteerHistoryEq.mockImplementation((field: string, value: any) => {
      if (field === 'volunteer_id') {
        return {
          eq: supabase.__mocks__.volunteerHistoryEq2,
        };
      }
      return {
        maybeSingle: supabase.__mocks__.volunteerHistoryMaybeSingle,
      };
    });

    supabase.__mocks__.volunteerHistoryEq2.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    supabase.__mocks__.volunteerHistoryMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    // Mock 'volunteer_history' insert response: error
    supabase.__mocks__.volunteerHistoryInsert.mockResolvedValueOnce({
      error: { message: 'Insert error' },
    });

    const result = await handleManualMatch(mockVolunteer, mockEvent);

    // Assertions for 'volunteer_history' select
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistorySelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.volunteerHistoryEq).toHaveBeenCalledWith('volunteer_id', mockVolunteer.id);
    expect(supabase.__mocks__.volunteerHistoryEq2).toHaveBeenCalledWith('event_id', mockEvent.id);
    expect(supabase.__mocks__.volunteerHistoryMaybeSingle).toHaveBeenCalled();

    // Assertions for 'volunteer_history' insert
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistoryInsert).toHaveBeenCalledWith([{
      volunteer_id: mockVolunteer.id,
      event_id: mockEvent.id,
      participation_status: 'upcoming',
      event_name: mockEvent.event_name,
      location: mockEvent.location,
      event_date: mockEvent.event_date,
    }]);

    // No notification insert should be made
    expect(supabase.__mocks__.notificationsInsert).not.toHaveBeenCalled();

    // Final Assertions
    expect(result.success).toBe(false);
    expect(result.message).toBe('Error during manual match: Insert error');
  });

  it('should return an error if notification insertion fails', async () => {
    // Mock 'volunteer_history' select().eq().eq().maybeSingle() response: no existing match
    supabase.__mocks__.volunteerHistorySelect.mockImplementation(() => ({
      eq: supabase.__mocks__.volunteerHistoryEq,
    }));

    supabase.__mocks__.volunteerHistoryEq.mockImplementation((field: string, value: any) => {
      if (field === 'volunteer_id') {
        return {
          eq: supabase.__mocks__.volunteerHistoryEq2,
        };
      }
      return {
        maybeSingle: supabase.__mocks__.volunteerHistoryMaybeSingle,
      };
    });

    supabase.__mocks__.volunteerHistoryEq2.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    supabase.__mocks__.volunteerHistoryMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    // Mock 'volunteer_history' insert response: success
    supabase.__mocks__.volunteerHistoryInsert.mockResolvedValueOnce({
      error: null,
    });

    // Mock 'notifications' insert response: error
    supabase.__mocks__.notificationsInsert.mockResolvedValueOnce({
      error: { message: 'Notification insert error' },
    });

    const result = await handleManualMatch(mockVolunteer, mockEvent);

    // Assertions for 'volunteer_history' select
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistorySelect).toHaveBeenCalledWith('*');
    expect(supabase.__mocks__.volunteerHistoryEq).toHaveBeenCalledWith('volunteer_id', mockVolunteer.id);
    expect(supabase.__mocks__.volunteerHistoryEq2).toHaveBeenCalledWith('event_id', mockEvent.id);
    expect(supabase.__mocks__.volunteerHistoryMaybeSingle).toHaveBeenCalled();

    // Assertions for 'volunteer_history' insert
    expect(supabase.from).toHaveBeenCalledWith('volunteer_history');
    expect(supabase.__mocks__.volunteerHistoryInsert).toHaveBeenCalledWith([{
      volunteer_id: mockVolunteer.id,
      event_id: mockEvent.id,
      participation_status: 'upcoming',
      event_name: mockEvent.event_name,
      location: mockEvent.location,
      event_date: mockEvent.event_date,
    }]);

    // Assertions for 'notifications' insert
    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(supabase.__mocks__.notificationsInsert).toHaveBeenCalledWith([{
      volunteer_id: mockVolunteer.id,
      message: `You have been matched to the event: ${mockEvent.event_name}`,
      event_name: mockEvent.event_name,
      date: mockEvent.event_date,
      time: expect.any(String),
      location: mockEvent.location,
      is_read: false,
      created_at: expect.any(Date),
      description: `You are now scheduled to attend the event "${mockEvent.event_name}" at ${mockEvent.location}.`,
    }]);

    // Final Assertions
    expect(result.success).toBe(false);
    expect(result.message).toBe('Error during manual match: Notification insert error');
  });
});
