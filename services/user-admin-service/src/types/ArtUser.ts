export interface ArtUser {
  id: string;               
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  plan?: 'free' | 'pro' | 'pro_plus';
  role?: 'admin' | 'user' | 'artist';
  status?: 'active' | 'banned' | 'suspended' | 'deleted';
}
