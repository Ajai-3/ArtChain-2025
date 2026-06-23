export interface IEmailTokenVerifier {
  verifyEmail(token: string): {
    name?: string;
    email?: string;
    username?: string;
    newEmail?: string;
  } | null;
}
