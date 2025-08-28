import { StartRegisterRequestDto } from './StartRegisterRequestDto';

export interface RegisterRequestDto extends StartRegisterRequestDto {
  password: string;
}
