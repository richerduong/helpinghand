// app/events/manage/actions.test.ts

import { fetchEvents, deleteEvent, updateEvent, insertEvent } from './actions';
import supabase from '@/api/supabaseClient';
import { event } from '@/types/types';

// Mock Supabase client
jest.mock('@/api/supabaseClient', () => {
  // Create separate mock functions for each method
  const mockSelect = jest.fn();
  const mockDelete = jest.fn();
  const mockUpdate = jest.fn();
  const mockInsert = jest.fn();
  const mockEq = jest.fn();

  // Create mock return objects for method chaining
  const mockFromEvents = {
    select: mockSelect,
    delete: mockDelete,
    update: mockUpdate,
    insert: mockInsert,
  };

  // Define how each method behaves
  mockSelect.mockReturnValue({
    eq: mockEq,
    // Add other chainable methods if needed
  });

  mockDelete.mockReturnValue({
    eq: mockEq,
  });

  mockUpdate.mockReturnValue({
    eq: mockEq,
  });

  mockInsert.mockReturnValue({
    // Define chainable methods for insert if needed
  });

  const mockFrom = jest.fn().mockImplementation((table: string) => {
    if (table === 'events') {
      return mockFromEvents;
    }
    return {
      select: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      insert: jest.fn(),
      eq: jest.fn(),
    };
  });

  return {
    from: mockFrom,
    auth: {
      getUser: jest.fn(),
    },
    __mocks__: {
      from: mockFrom,
      select: mockSelect,
      delete: mockDelete,
      update: mockUpdate,
      insert: mockInsert,
      eq: mockEq,
    },
  };
});

describe('Server Actions', () => {
  const mockEvent: event = {
    id: 1,
    event_name: 'Test Event',
    event_description: 'Description',
    location: 'Location',
    required_skills: ['React', 'JavaScript'],
    urgency: 'High',
    event_date: new Date('2023-10-25'),
  };

  describe('fetchEvents', () => {
    it('should fetch events successfully', async () => {
      const mockData = [mockEvent];

      // Mock a successful response from Supabase
      supabase.__mocks__.select.mockResolvedValueOnce({
        data: mockData,
        error: null,
      });

      const { data, error } = await fetchEvents();

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.select).toHaveBeenCalledWith('*');

      // Check the returned data and error
      expect(data).toEqual(mockData);
      expect(error).toBeNull();
    });

    it('should return an error when fetching events fails', async () => {
      const mockError = 'Fetch error';

      // Mock a failed response from Supabase
      supabase.__mocks__.select.mockResolvedValueOnce({
        data: null,
        error: { message: mockError },
      });

      const { data, error } = await fetchEvents();

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.select).toHaveBeenCalledWith('*');

      // Check the returned data and error
      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      // Mock a successful delete response from Supabase
      supabase.__mocks__.delete.mockResolvedValueOnce({
        error: null,
      });

      const error = await deleteEvent(1);

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.delete).toHaveBeenCalled();
      expect(supabase.__mocks__.eq).toHaveBeenCalledWith('id', 1);

      // Check the returned error
      expect(error).toBeNull();
    });

    it('should return an error when deleting an event fails', async () => {
      const mockError = 'Delete error';

      // Mock a failed delete response from Supabase
      supabase.__mocks__.delete.mockResolvedValueOnce({
        error: { message: mockError },
      });

      const error = await deleteEvent(1);

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.delete).toHaveBeenCalled();
      expect(supabase.__mocks__.eq).toHaveBeenCalledWith('id', 1);

      // Check the returned error
      expect(error).toEqual(mockError);
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      // Mock a successful update response from Supabase
      supabase.__mocks__.update.mockResolvedValueOnce({
        error: null,
      });

      // Mock the 'eq' method to resolve without error
      supabase.__mocks__.eq.mockResolvedValueOnce({
        error: null,
      });

      const error = await updateEvent(mockEvent);

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.update).toHaveBeenCalledWith({
        event_name: mockEvent.event_name,
        event_description: mockEvent.event_description,
        location: mockEvent.location,
        required_skills: mockEvent.required_skills,
        urgency: mockEvent.urgency,
        event_date: mockEvent.event_date.toISOString(),
        updated_at: expect.any(String),
      });
      expect(supabase.__mocks__.eq).toHaveBeenCalledWith('id', mockEvent.id);

      // Check the returned error
      expect(error).toBeNull();
    });

    it('should return an error when updating an event fails', async () => {
      const mockError = 'Update error';

      // Mock a failed update response from Supabase
      supabase.__mocks__.update.mockResolvedValueOnce({
        error: { message: mockError },
      });

      // Even if 'eq' is called, Supabase returns an error
      supabase.__mocks__.eq.mockResolvedValueOnce({
        error: { message: mockError },
      });

      const error = await updateEvent(mockEvent);

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.update).toHaveBeenCalledWith({
        event_name: mockEvent.event_name,
        event_description: mockEvent.event_description,
        location: mockEvent.location,
        required_skills: mockEvent.required_skills,
        urgency: mockEvent.urgency,
        event_date: mockEvent.event_date.toISOString(),
        updated_at: expect.any(String),
      });
      expect(supabase.__mocks__.eq).toHaveBeenCalledWith('id', mockEvent.id);

      // Check the returned error
      expect(error).toEqual(mockError);
    });
  });

  describe('insertEvent', () => {
    it('should insert a new event successfully', async () => {
      // Mock a successful insert response from Supabase
      supabase.__mocks__.insert.mockResolvedValueOnce({
        error: null,
      });

      const error = await insertEvent(mockEvent);

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.insert).toHaveBeenCalledWith([
        {
          event_name: mockEvent.event_name,
          event_description: mockEvent.event_description,
          location: mockEvent.location,
          required_skills: mockEvent.required_skills,
          urgency: mockEvent.urgency,
          event_date: mockEvent.event_date.toISOString(),
        },
      ]);

      // Check the returned error
      expect(error).toBeNull();
    });

    it('should return an error when inserting an event fails', async () => {
      const mockError = 'Insert error';

      // Mock a failed insert response from Supabase
      supabase.__mocks__.insert.mockResolvedValueOnce({
        error: { message: mockError },
      });

      const error = await insertEvent(mockEvent);

      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.__mocks__.insert).toHaveBeenCalledWith([
        {
          event_name: mockEvent.event_name,
          event_description: mockEvent.event_description,
          location: mockEvent.location,
          required_skills: mockEvent.required_skills,
          urgency: mockEvent.urgency,
          event_date: mockEvent.event_date.toISOString(),
        },
      ]);

      // Check the returned error
      expect(error).toEqual(mockError);
    });
  });
});
