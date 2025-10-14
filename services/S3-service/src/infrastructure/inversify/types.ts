export const TYPES = {
  // Repositories
  IFileRepository: Symbol.for("IFileRepository"),

  // Use Cases
  IUploadArtImage: Symbol.for("IUploadArtImage"),
  IUploadImageUseCase: Symbol.for("IUploadImageUseCase"),
  IDeleteImageUseCase: Symbol.for("IDeleteImageUseCase"),

  // Controllers
  IUploadController: Symbol.for("IUploadController"),
};
