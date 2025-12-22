export interface ILogoutUserUseCase {
  execute(refreshToken: string): Promise<void>;
}