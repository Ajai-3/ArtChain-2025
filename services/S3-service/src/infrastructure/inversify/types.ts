export const TYPES = {
  // Repositories
  IFileRepository: Symbol.for("IFileRepository"),

  // Use Cases
  IUploadArtImage: Symbol.for("IUploadArtImage"),
  IUploadImageUseCase: Symbol.for("IUploadImageUseCase"),
  IDeleteImageUseCase: Symbol.for("IDeleteImageUseCase"),
  IGetSignedUrlUseCase: Symbol.for("IGetSignedUrlUseCase"),

  // Controllers
  IUploadController: Symbol.for("IUploadController"),
};
