import { Option } from "@/components/MultiSelectDropdown";

export const stateOptions = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export const skillOptions: Option[] = [
  { label: "First Aid", value: "first-aid" },
  { label: "Event Management", value: "event-management" },
  { label: "Fundraising", value: "fundraising" },
  { label: "Teaching & Mentoring", value: "teaching-mentoring" },
  { label: "Cooking", value: "cooking" },
  { label: "Transportation Assistance", value: "transportation-assistance" },
  { label: "Administrative Work", value: "administrative-work" },
  { label: "Disaster Relief", value: "disaster-relief" },
  { label: "Community Outreach", value: "community-outreach" },
  { label: "Technical Support", value: "technical-support" },
  { label: "Language Translation", value: "language-translation" },
  // Add more skills as needed
];

export const urgencyOptions = [
  'None', 'Low', 'Medium', 'High', 'Crtitical'
];