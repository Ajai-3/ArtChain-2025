export interface IndexedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  bannerImage?: string;
  bio?: string;
  role?: 'admin' | 'user' | 'artist';
  status?: 'active' | 'banned' | 'suspended' | 'deleted';
  createdAt: string;
}
