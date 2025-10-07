import { ArtistAproveRejectRequestDto } from '../../../dtos/admin/user-management/ArtistAproveRejectRequestDto';

export interface IRejectArtistRequestUseCase {
  execute(dto: ArtistAproveRejectRequestDto): Promise<any>;
}