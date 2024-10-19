import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "./supabaseClient";

// Define a partial profile type matching the selected fields
interface PartialProfile {
  id: number;
  skills: string[];
  availability: Date[];  // Assuming this is an array of dates
  is_admin: boolean;
}

interface Event {
  id: number;
  required_skills: string[];
  event_name: string;
  location: string;
  event_date: Date;  // Assuming this is a Date object
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
        console.log("hi")
      // Fetch volunteers (non-admin)
      const { data: volunteerData, error: volunteerError } = await supabase
        .from('profiles')
        .select('id, skills, availability, is_admin')
        .eq('is_admin', false);  // Only non-admins are considered volunteers

      // Fetch events
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('id, required_skills, event_name, location, event_date');

      if (volunteerError || eventError) {
        return res.status(500).json({ error: 'Error fetching volunteers or events' });
      }

      // Matching logic: Volunteers to Events
      const matches = (volunteerData as PartialProfile[]).map((volunteer: PartialProfile) => {
        const matchedEvent = (eventData as Event[]).find((event: Event) => {
          // Check if the event date falls within the volunteer's availability
          const isDateAvailable = volunteer.availability.some(date => 
            new Date(event.event_date).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10)
          );

          // Check if the volunteer has at least one matching skill
          const hasMatchingSkills = event.required_skills.some(skill =>
            volunteer.skills.includes(skill)
          );

          return isDateAvailable && hasMatchingSkills;
        });

        return {
          volunteer_id: volunteer.id,
          matched_event: matchedEvent ? matchedEvent.event_name : 'No matching event',
          location: matchedEvent ? matchedEvent.location : null,
          event_date: matchedEvent ? matchedEvent.event_date : null
        };
      });

      // Return the matched data
      return res.status(200).json({ matches });

    } catch (error) {
      console.error('Error matching volunteers and events:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
