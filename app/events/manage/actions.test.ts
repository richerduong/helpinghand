import { fetchEvents, deleteEvent, updateEvent, insertEvent } from './actions';
import supabase from '@/api/supabaseClient';
import { event } from '@/types/types';

// Mock Supabase client
jest.mock('@/api/supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),  // Return `this` to allow chaining
    delete: jest.fn().mockReturnThis(),  // Return `this` to allow chaining
    update: jest.fn().mockReturnThis(),  // Mock for update calls
    insert: jest.fn().mockReturnThis(),  // Mock for insert calls
    eq: jest.fn().mockReturnThis(),      // Return `this` to allow chaining
  })),
}));

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
      (supabase.from('events').select as jest.Mock).mockResolvedValue({
        data: mockData,
        error: null,
      });

      const { data, error } = await fetchEvents();
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').select).toHaveBeenCalled();
      
      // Check the returned data and error
      expect(data).toEqual(mockData);
      expect(error).toBeNull();
    });

    it('should return an error when fetching events fails', async () => {
      const mockError = 'Fetch error';

      // Mock a failed response from Supabase
      (supabase.from('events').select as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: mockError },
      });

      const { data, error } = await fetchEvents();
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').select).toHaveBeenCalled();
      
      // Check the returned data and error
      expect(data).toBeNull();
      expect(error).toEqual(mockError);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      // Mock a successful delete response from Supabase
      (supabase.from('events').delete().eq as jest.Mock).mockResolvedValue({
        error: null,
      });

      const error = await deleteEvent(1);
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').delete).toHaveBeenCalled();
      expect(supabase.from('events').delete().eq).toHaveBeenCalledWith('id', 1);
      
      // Check the returned error
      expect(error).toBeNull();
    });

    it('should return an error when deleting an event fails', async () => {
      const mockError = 'Delete error';

      // Mock a failed delete response from Supabase
      (supabase.from('events').delete().eq as jest.Mock).mockResolvedValue({
        error: { message: mockError },
      });

      const error = await deleteEvent(1);
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').delete).toHaveBeenCalled();
      expect(supabase.from('events').delete().eq).toHaveBeenCalledWith('id', 1);
      
      // Check the returned error
      expect(error).toEqual(mockError);
    });
  });

  describe('updateEvent', () => {
    it('should update an event successfully', async () => {
      // Mock a successful update response from Supabase
      (supabase.from('events').update({}).eq('id', mockEvent.id) as unknown as jest.Mock).mockResolvedValue({
        error: null,
      });

      const error = await updateEvent(mockEvent);
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').update).toHaveBeenCalled();
      expect(supabase.from('events').update).toHaveBeenCalledWith(expect.any(Object));
      expect(supabase.from('events').update({}).eq).toHaveBeenCalledWith('id', mockEvent.id);
      
      // Check the returned error
      expect(error).toBeNull();
    });

    it('should return an error when updating an event fails', async () => {
      const mockError = 'Update error';

      // Mock a failed update response from Supabase
      (supabase.from('events').update({}).eq('id', mockEvent.id) as unknown as jest.Mock).mockResolvedValue({
        error: { message: mockError },
      });

      const error = await updateEvent(mockEvent);
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').update).toHaveBeenCalled();
      expect(supabase.from('events').update).toHaveBeenCalledWith(expect.any(Object));
      expect(supabase.from('events').update({}).eq).toHaveBeenCalledWith('id', mockEvent.id);
      
      // Check the returned error
      expect(error).toEqual(mockError);
    });
  });

  describe('insertEvent', () => {
    it('should insert a new event successfully', async () => {
      // Mock a successful insert response from Supabase
      (supabase.from('events').insert as jest.Mock).mockResolvedValue({
        error: null,
      });

      const error = await insertEvent(mockEvent);
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').insert).toHaveBeenCalledWith([{
        event_name: mockEvent.event_name,
        event_description: mockEvent.event_description,
        location: mockEvent.location,
        required_skills: mockEvent.required_skills,
        urgency: mockEvent.urgency,
        event_date: mockEvent.event_date.toISOString(),
      }]);
      
      // Check the returned error
      expect(error).toBeNull();
    });

    it('should return an error when inserting an event fails', async () => {
      const mockError = 'Insert error';

      // Mock a failed insert response from Supabase
      (supabase.from('events').insert as jest.Mock).mockResolvedValue({
        error: { message: mockError },
      });

      const error = await insertEvent(mockEvent);
      
      // Check that the mock Supabase call happened
      expect(supabase.from).toHaveBeenCalledWith('events');
      expect(supabase.from('events').insert).toHaveBeenCalled();
      
      // Check the returned error
      expect(error).toEqual(mockError);
    });
  });
});
