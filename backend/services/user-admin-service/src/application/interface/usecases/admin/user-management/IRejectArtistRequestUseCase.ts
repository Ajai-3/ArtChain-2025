import { ArtistAproveRejectRequestDto } from '../../../dtos/admin/user-management/ArtistAproveRejectRequestDto';
import { RejectArtistResultResponse } from '../../../../../types/responses/admin/RejectArtistResultResponse';

export interface IRejectArtistRequestUseCase {
  execute(dto: ArtistAproveRejectRequestDto): Promise<RejectArtistResultResponse>;
}
