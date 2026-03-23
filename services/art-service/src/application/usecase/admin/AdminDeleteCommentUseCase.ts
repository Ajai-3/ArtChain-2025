import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IAdminDeleteCommentUseCase } from '../../interface/usecase/admin/IAdminDeleteCommentUseCase';
import { BadRequestError } from 'art-chain-shared';
import { ERROR_MESSAGES } from '../../../constants/ErrorMessages';

@injectable()
export class AdminDeleteCommentUseCase implements IAdminDeleteCommentUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository
  ) {}

  async execute(id: string): Promise<void> {
    const comment = await this._commentRepository.getById(id);

    if (!comment) {
      throw new BadRequestError(ERROR_MESSAGES.COMMENT_NOT_FOUND);
    }

    await this._commentRepository.delete(id);
  }
}
