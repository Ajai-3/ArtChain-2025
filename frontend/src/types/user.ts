export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'artist' | 'admin';
  plan: 'free' | 'pro' | 'pro_plus';
  status: 'active' | 'banned' | 'suspended' | 'deleted';
  isVerified: boolean;
  profileImage?: string;
  bannerImage?: string;
  backgroundImage?: string;
  bio?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}