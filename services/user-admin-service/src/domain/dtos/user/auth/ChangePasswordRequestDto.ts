export interface ChangePasswordRequestDto {
  userId: string;
  currentPassword: string;
  newPassword: string;
}