export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly username: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly password: string,
    public readonly isVerified: boolean,
    public readonly profileImage: string | null,
    public readonly bannerImage: string | null,
    public readonly backgroundImage: string | null,
    public readonly bio: string | null,
    public readonly country: string | null,
    public readonly role: 'user' | 'admin' | 'artist',
    public readonly plan: 'free' | 'pro' | 'pro_plus',
    public readonly status: 'active' | 'banned' | 'suspended' | 'deleted',
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}

export type SafeUser = Omit<User, 'password'>;