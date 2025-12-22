import { StartRegisterRequestDto } from './StartRegisterRequestDto';

export interface RegisterRequestDto extends StartRegisterRequestDto {
  token?: string;
  password: string;
}
