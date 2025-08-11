import { StartRegisterDto } from './StartRegisterDto';

export interface RegisterDto extends StartRegisterDto {
    password: string
}