export interface ITokenGenerator {
  generateAccess(payload: object): string;
  generateRefresh(payload: object): string;
  generateEmailVerification(payload: object): string;
}
