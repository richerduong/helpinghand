import supabase from "@/api/supabaseClient";

export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select(
        "id, event_name, event_description, location, event_date, created_at, required_skills, urgency"
      )
      .order("event_date", { ascending: true });

    if (error) {
      throw error;
    }

    const formattedEvents = data.map((event: any) => {
      const eventDateUTC = new Date(event.event_date + "T00:00:00Z");
      const utcFormattedDate = eventDateUTC.toISOString().split("T")[0];

      const skillsArray = Array.isArray(event.required_skills)
        ? event.required_skills
        : event.required_skills
        ? event.required_skills.split(",")
        : [];

      return {
        id: event.id,
        name: event.event_name,
        description: event.event_description,
        location: event.location,
        date: utcFormattedDate,
        created_at: new Date(event.created_at).toISOString().split("T")[0],
        skills: skillsArray,
        urgency: event.urgency,
      };
    });

    return { events: formattedEvents, error: null };
  } catch (error) {
    return {
      events: null,
      error: (error as Error).message || "Error fetching events",
    };
  }
};
