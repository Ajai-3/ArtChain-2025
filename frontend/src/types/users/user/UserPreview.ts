export type UserPreview = {
    id: string,
    name: string,
    username: string,
    profileImage: string,
    isSupporting?: boolean,
    role: 'user' | 'artist',
    plan: 'free' | 'pro' | 'pro_plus',
}