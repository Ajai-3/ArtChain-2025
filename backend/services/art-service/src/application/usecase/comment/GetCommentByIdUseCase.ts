import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IGetCommentByIdUseCase } from '../../interface/usecase/comment/IGetCommentByIdUseCase';
import { IUserService } from '../../interface/service/IUserService';
import { Comment } from '../../../domain/entities/Comment';
import type { UserPublicProfile } from '../../../types/user';
import type { ArtPostLean } from '../../../types/art';

export type CommentWithDetails = Comment & {
  user: UserPublicProfile | null;
  art: (ArtPostLean & { user: UserPublicProfile | null }) | null;
};

@injectable()
export class GetCommentByIdUseCase implements IGetCommentByIdUseCase {
  constructor(
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService
  ) {}

  async execute(commentId: string): Promise<CommentWithDetails | null> {
    const comment = await this._commentRepository.getById(commentId);
    if (!comment) return null;
    
    const commentOwner = await this._userService.getUserById(comment.userId);

    const art = await this._artRepo.getById(comment.postId);
    let artOwner = null;
    if (art) {
        artOwner = await this._userService.getUserById(art.userId);
    }

    return { 
        ...comment, 
        user: commentOwner,
        art: art ? { ...art, user: artOwner } : null 
    };
  }
}
