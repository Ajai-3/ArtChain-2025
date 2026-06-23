import { ArtistAproveRejectRequestDto } from '../../../dtos/admin/user-management/ArtistAproveRejectRequestDto';
import { ApproveArtistResultResponse } from '../../../../../types/responses/admin/ApproveArtistResultResponse';

export interface IApproveArtistRequestUseCase {
  execute(
    dto: ArtistAproveRejectRequestDto,
  ): Promise<ApproveArtistResultResponse>;
}
