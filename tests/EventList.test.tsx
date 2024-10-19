//fails
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventList from '@/app/events/manage/EventList';
import supabase from '@/api/supabaseClient';
import '@testing-library/jest-dom';

jest.mock('@/api/supabaseClient', () => ({
  from: jest.fn(() => ({
    insert: jest.fn(),
    update: jest.fn(),
  })),
}));

const mockEvents = [
  {
    id: 1,
    event_name: 'Event 1',
    event_description: 'Description 1',
    location: 'Location 1',
    required_skills: ['skill1', 'skill2'],
    urgency: 'High',
    event_date: new Date().toISOString(),
  },
  {
    id: 2,
    event_name: 'Event 2',
    event_description: 'Description 2',
    location: 'Location 2',
    required_skills: ['skill3'],
    urgency: 'Medium',
    event_date: new Date().toISOString(),
  },
];

describe('EventList Component', () => {
  const mockOnEditEvent = jest.fn();

  beforeEach(() => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: mockEvents, error: null }),
      delete: jest.fn().mockResolvedValue({ error: null }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<EventList onEditEvent={mockOnEditEvent} />);
    expect(screen.getByText(/loading events.../i)).toBeInTheDocument();
  });

  test('renders events after loading', async () => {
    render(<EventList onEditEvent={mockOnEditEvent} />);
    await waitFor(() => expect(screen.queryByText(/loading events.../i)).not.toBeInTheDocument());

    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Event 2')).toBeInTheDocument();
  });

  test('handles edit event click', async () => {
    render(<EventList onEditEvent={mockOnEditEvent} />);
    await waitFor(() => expect(screen.queryByText(/loading events.../i)).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockOnEditEvent).toHaveBeenCalledWith(mockEvents[0]);
  });

  test('handles delete event click', async () => {
    window.confirm = jest.fn().mockReturnValue(true);
    render(<EventList onEditEvent={mockOnEditEvent} />);
    await waitFor(() => expect(screen.queryByText(/loading events.../i)).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(supabase.from().delete).toHaveBeenCalledWith();
    expect(supabase.from().delete().eq).toHaveBeenCalledWith('id', 1);
  });

  test('does not delete event if confirmation is cancelled', async () => {
    window.confirm = jest.fn().mockReturnValue(false);
    render(<EventList onEditEvent={mockOnEditEvent} />);
    await waitFor(() => expect(screen.queryByText(/loading events.../i)).not.toBeInTheDocument());

    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(supabase.from().delete).not.toHaveBeenCalled();
  });
});
