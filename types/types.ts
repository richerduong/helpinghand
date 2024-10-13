import { Option } from "@/components/MultiSelectDropdown";

export interface profiles {
  email: string;
  full_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
  skills: Option[];
  preferences: string;
  availability: Date[];
  is_admin: boolean;
}

export interface events {
  event_name: string;
  event_description: string;
  location: string;
  required_skills: string[];
  urgency: string;
  event_date: Date;
}