export interface IRefreshTokenVerifier {
  verify(token: string): {
    id?: string;
    username?: string;
  } | null;
}
