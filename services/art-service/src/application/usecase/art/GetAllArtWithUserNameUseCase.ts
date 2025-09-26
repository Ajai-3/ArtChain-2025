import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";

export class GetAllArtWithUserNameUseCase {
    constructor(private readonly _artRepo: IArtPostRepository, private readonly _likeRepo: ILikeRepository, private readonly _commentRepo: ICommentRepository) {}
   async execute(
        userId: string,  // Changed from username to userId
        page: number,
        limit: number,
        currentUserId: string
    ): Promise<any[]> {

        console.log("Fetching art for user ID:", userId);
        
        // // Get user by ID instead of username
        const user = await UserService.getUserById(userId);
        if (!user) throw new Error(`User with ID ${userId} not found`);

        const arts = await this._artRepo.getAllByUser(userId, page, limit);
        if (!arts.length) return [];

        return await Promise.all(
            arts.map(async (art: any) => {
                const likeCount = await this._likeRepo.likeCountByPostId(art._id);
                const commentCount = await this._commentRepo.countByPostId(art._id);
                const isLiked = !!(
                    currentUserId && (await this._likeRepo.findLike(art._id, currentUserId))
                );

                return {
                    ...toArtWithUserResponse(art, user),
                    likeCount,
                    commentCount,
                    isLiked,
                };
            })
        );
    }
}