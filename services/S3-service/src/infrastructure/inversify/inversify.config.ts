import "reflect-metadata";
import { TYPES } from "./types";
import { Container } from "inversify";
import { S3FileRepository } from "../repositories/S3FileRepository";
import { UploadArtImage } from "../../application/usecases/UploadArtImage";
import { IFileRepository } from "../../domain/repositories/IFileRepository";
import { DeleteImageUseCase } from "../../application/usecases/DeleteImageUseCase";
import { UploadImageUseCase } from "../../application/usecases/UploadImageUseCase";
import { UploadController } from "../../presentation/controllers/UploadController";
import { IUploadController } from "./../../presentation/interface/IUploadController";
import { IDeleteImageUseCase } from "../../application/interface/usecases/IDeleteImageUseCase";
import { IUploadImageUseCase } from "../../application/interface/usecases/IUploadImageUseCase";
import { IGetSignedUrlUseCase } from "../../application/interface/usecases/IGetSignedUrlUseCase";
import { GetSignedUrlUseCase } from "../../application/usecases/GetSignedUrlUseCase";

const container = new Container();

// Repositories
container
  .bind<IFileRepository>(TYPES.IFileRepository)
  .to(S3FileRepository)
  .inSingletonScope();

// Use Cases
container.bind<UploadArtImage>(TYPES.IUploadArtImage).to(UploadArtImage);
container
  .bind<IDeleteImageUseCase>(TYPES.IDeleteImageUseCase)
  .to(DeleteImageUseCase);
container
  .bind<IUploadImageUseCase>(TYPES.IUploadImageUseCase)
  .to(UploadImageUseCase);
container
  .bind<IGetSignedUrlUseCase>(TYPES.IGetSignedUrlUseCase)
  .to(GetSignedUrlUseCase);

// Controllers
container.bind<IUploadController>(TYPES.IUploadController).to(UploadController);

export { container };
