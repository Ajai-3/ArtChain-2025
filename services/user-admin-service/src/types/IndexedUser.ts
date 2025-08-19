export interface IndexedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  bannerImage?: string;
  bio?: string;
  role?: 'admin' | 'user' | "artist";
  createdAt: string;
  status?: 'active' | 'banned' | "suspended" |"deleted";
}
