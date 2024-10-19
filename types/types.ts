import { Option } from "@/components/MultiSelectDropdown";

export interface profile {
  id: number;
  email: string;
  full_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
  skills: string[];
  preferences: string;
  availability: Date[];
  is_admin: boolean;
}

export interface event {
  id: number;
  event_name: string;
  event_description: string;
  location: string;
  required_skills: string[];
  urgency: string;
  event_date: Date;
}

export interface VolunteerHistory {
  id: number;
  created_at: string;
  updated_at: string;
  volunteer_id: number;
  event_id: number;
  participation_status: string;
  event_name: string;
  location: string;
  event_date: string;
}