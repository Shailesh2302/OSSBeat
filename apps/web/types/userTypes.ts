export interface UserProfile {
  id: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  display_name: string | null;
  last_login_at: string | null;
  profile_url: string | null;
  username: string;
  show_profile: boolean;
}
