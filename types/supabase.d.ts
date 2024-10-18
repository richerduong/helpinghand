export interface User {
  id: string;
  email: string | null;
  role: string | null; // Add any other custom properties like `role` if needed
  aud: string;
  created_at: string;
}

export interface Session {
  user: User | null;
  access_token: string;
  token_type: string;
  expires_at: number | null;
}
