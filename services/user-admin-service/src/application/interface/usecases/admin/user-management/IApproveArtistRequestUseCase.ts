import { ArtistAproveRejectRequestDto } from "../../../dtos/admin/user-management/ArtistAproveRejectRequestDto";

export interface IApproveArtistRequestUseCase {
  execute(dto: ArtistAproveRejectRequestDto): Promise<any>;
}