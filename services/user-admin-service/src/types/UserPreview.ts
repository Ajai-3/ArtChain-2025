export type UserPreview = {
    name: string,
    username: string,
    profileImage: string,
    role: 'user' | 'artist',
    plan: 'free' | 'pro' | 'pro_plus',
}