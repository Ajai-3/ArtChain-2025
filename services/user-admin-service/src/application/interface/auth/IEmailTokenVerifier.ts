export interface IEmailTokenVerifier {
  verify(token: string): {
    email?: string;
  } | null;
}
