export interface IGoogleTokenVerifier {
  verify(token: string): Promise<{ email: string; name: string }>;
}
