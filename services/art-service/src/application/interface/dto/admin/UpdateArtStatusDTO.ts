import { PostStatus } from "../../../../domain/entities/ArtPost";

export interface UpdateArtStatusDTO {
  id: string;
  status: PostStatus;
}
