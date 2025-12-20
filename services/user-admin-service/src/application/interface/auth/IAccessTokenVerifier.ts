export interface IAccessTokenVerifier {
  verify(token: string): {
    id?: string;
    username?: string;
    role?: string;
  } | null;
}
