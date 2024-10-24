'use server';

import { event } from '@/types/types';
import supabase from '@/api/supabaseClient';

// Fetch events from Supabase (server-side)
export const fetchEvents = async (): Promise<{ data: event[] | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) throw new Error(error.message);
    return { data: data as event[], error: null };
  } catch (error: any) {
    return { data: null, error: (error as Error).message };
  }
};

// Delete an event from Supabase (server-side)
export const deleteEvent = async (id: number): Promise<string | null> => {
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return null; // Success, no error
  } catch (error: any) {
    return error.message;
  }
};

// Update an existing event in Supabase (server-side)
export const updateEvent = async (manageInfo: event): Promise<string | null> => {
  try {
    const { error } = await supabase
      .from('events')
      .update({
        event_name: manageInfo.event_name,
        event_description: manageInfo.event_description,
        location: manageInfo.location,
        required_skills: manageInfo.required_skills,
        urgency: manageInfo.urgency,
        event_date: manageInfo.event_date.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', manageInfo.id);

    if (error) throw new Error(error.message);
    return null; // Success, no error
  } catch (error: any) {
    return error.message;
  }
};

// Insert a new event into Supabase (server-side)
export const insertEvent = async (manageInfo: event): Promise<string | null> => {
  try {
    const { error } = await supabase
      .from('events')
      .insert([
        {
          event_name: manageInfo.event_name,
          event_description: manageInfo.event_description,
          location: manageInfo.location,
          required_skills: manageInfo.required_skills,
          urgency: manageInfo.urgency,
          event_date: manageInfo.event_date.toISOString(),
        },
      ]);

    if (error) throw new Error(error.message);
    return null; // Success, no error
  } catch (error: any) {
    return error.message;
  }
};
