//fails
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventForm from '@/app/events/manage/EventForm';
import supabase from '@/api/supabaseClient';
import '@testing-library/jest-dom';

jest.mock('@/api/supabaseClient', () => ({
  from: jest.fn(() => ({
    insert: jest.fn(),
    update: jest.fn(),
  })),
}));

describe('EventForm', () => {
  const mockOnFormSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form inputs correctly', () => {
    render(<EventForm onFormSubmit={mockOnFormSubmit} />);

    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/required skills/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/urgency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
  });

  test('allows user to fill in the form', () => {
    render(<EventForm onFormSubmit={mockOnFormSubmit} />);

    fireEvent.change(screen.getByLabelText(/event name/i), { target: { value: 'New Event' } });
    fireEvent.change(screen.getByLabelText(/event description/i), { target: { value: 'This is a description.' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Online' } });

    expect(screen.getByLabelText(/event name/i)).toHaveValue('New Event');
    expect(screen.getByLabelText(/event description/i)).toHaveValue('This is a description.');
    expect(screen.getByLabelText(/location/i)).toHaveValue('Online');
  });

  test('submits the form and calls onFormSubmit', async () => {
    const mockInsert = supabase.from().insert as jest.Mock;
    render(<EventForm onFormSubmit={mockOnFormSubmit} />);

    fireEvent.change(screen.getByLabelText(/event name/i), { target: { value: 'New Event' } });
    fireEvent.change(screen.getByLabelText(/event description/i), { target: { value: 'This is a description.' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Online' } });

    mockInsert.mockResolvedValueOnce({ error: null });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnFormSubmit).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  test('handles submission error', async () => {
    const mockInsert = supabase.from().insert as jest.Mock;
    render(<EventForm onFormSubmit={mockOnFormSubmit} />);

    fireEvent.change(screen.getByLabelText(/event name/i), { target: { value: 'New Event' } });
    fireEvent.change(screen.getByLabelText(/event description/i), { target: { value: 'This is a description.' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Online' } });

    mockInsert.mockResolvedValueOnce({ error: 'Some error' });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
    });
  });
});
