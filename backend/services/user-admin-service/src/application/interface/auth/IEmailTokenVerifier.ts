export interface IEmailTokenVerifier {
  verifyEmail(token: string): {
    email?: string;
    newEmail?: string;
  } | null;
}
