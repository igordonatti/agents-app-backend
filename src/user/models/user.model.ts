export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional, as it should not be exposed
  created_at: Date;
}
