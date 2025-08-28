export interface StartRegisterResultDto {
  token: string;
  payload: {
    name: string;
    username: string;
    email: string;
  };
}