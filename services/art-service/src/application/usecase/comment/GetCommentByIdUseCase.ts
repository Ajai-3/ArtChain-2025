import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IGetCommentByIdUseCase } from '../../interface/usecase/comment/IGetCommentByIdUseCase';
import { IUserService } from '../../interface/service/IUserService';
import { Comment } from '../../../domain/entities/Comment';

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

  async execute(commentId: string): Promise<any> {
    const comment = await this._commentRepository.getById(commentId);
    if (!comment) return null;
    
    // Fetch comment owner
    const commentOwner = await this._userService.getUserById(comment.userId);

    // Fetch associated artwork
    const art = await this._artRepo.getById(comment.postId);
    let artOwner = null;
    if (art) {
        // Fetch art owner for navigation: /username/art/artname
        artOwner = await this._userService.getUserById(art.userId);
    }

    return { 
        ...comment, 
        user: commentOwner,
        art: art ? { ...art, user: artOwner } : null 
    };
  }
}
