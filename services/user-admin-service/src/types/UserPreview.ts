export type UserPreview = {
    id: string,
    name: string,
    username: string,
    profileImage: string | null,
    role: 'user' | 'artist',
    plan: 'free' | 'pro' | 'pro_plus',
}