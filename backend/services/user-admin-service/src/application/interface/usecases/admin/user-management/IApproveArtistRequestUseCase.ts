import { ArtistAproveRejectRequestDto } from '../../../dtos/admin/user-management/ArtistAproveRejectRequestDto';
import { ApproveArtistResponse } from '../../../../../types/responses/admin/ApproveArtistResponse';
import { ApproveArtistResultResponse } from '../../../../../types/responses/admin/ApproveArtistResultResponse';

export type { ApproveArtistResponse };

export interface IApproveArtistRequestUseCase {
  execute(
    dto: ArtistAproveRejectRequestDto,
  ): Promise<ApproveArtistResultResponse>;
}
