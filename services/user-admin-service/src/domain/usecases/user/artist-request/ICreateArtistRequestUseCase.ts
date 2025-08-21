import { ArtistRequest } from "@prisma/client";
import { CreateArtistRequestDto } from "../../../../domain/dtos/user/CreateArtistRequestDto";

export interface ICreateArtistRequestUseCase {
  execute(data: CreateArtistRequestDto): Promise<ArtistRequest>;
}
