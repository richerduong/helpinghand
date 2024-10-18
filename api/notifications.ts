import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "./supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { userId, eventId, message } = req.body;

    // Insert notification into Supabase
    const { data, error } = await supabase
      .from("notifications")
      .insert([{ user_id: userId, event_id: eventId, message }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
