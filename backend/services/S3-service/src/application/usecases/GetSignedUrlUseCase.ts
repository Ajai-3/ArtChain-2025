import { inject, injectable } from 'inversify';
import { IGetSignedUrlUseCase } from '../interface/usecases/IGetSignedUrlUseCase';
import { TYPES } from '../../infrastructure/inversify/types';
import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { FileCategory } from '../../types/FileCategory';
import { logger } from '../../infrastructure/utils/logger';
import { NotFoundError } from 'art-chain-shared';
import { UPLOAD_MESSAGES } from '../../constants/uploadMessages';

@injectable()
export class GetSignedUrlUseCase implements IGetSignedUrlUseCase {
  constructor(
    @inject(TYPES.IFileRepository)
    private readonly _fileRepository: IFileRepository,
  ) {}

  async execute(
    key: string,
    category: FileCategory,
    fileName: string,
  ): Promise<string> {
    if (!key || !category || !fileName) {
      throw new NotFoundError(UPLOAD_MESSAGES.MISSING_KEY_OR_CATEGORY);
    }

    logger.info(`🔍 execute called for category: ${category} | Key: ${key}`);

    return this._fileRepository.getSignedUrl(key, category, fileName);
  }
}
