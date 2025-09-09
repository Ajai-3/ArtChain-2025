import { ArtPost } from "../../domain/entities/ArtPost";
import { IArtPostRepository } from "../../domain/repositories/IArtPostRepository";
import { ArtPostModel } from "../models/ArtPostSchema";

export class IArtPostRepositoryImp implements IArtPostRepository {
  async create(post: ArtPost): Promise<ArtPost> {
    const created = await ArtPostModel.create(post);
    return created.toObject() as ArtPost;
  }

  async getById(id: string): Promise<ArtPost | null> {
    const art = await ArtPostModel.findOne({ id }).lean();
    return art as ArtPost | null;
  }

  async getAll(page = 1, limit = 10): Promise<ArtPost[]> {
    const arts = await ArtPostModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return arts as ArtPost[];
  }

  async getAllByUser(userId: string, page = 1, limit = 10): Promise<ArtPost[]> {
    const arts = await ArtPostModel.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return arts as ArtPost[];
  }

  async update(id: string, post: Partial<ArtPost>): Promise<ArtPost> {
    const updated = await ArtPostModel.findOneAndUpdate({ id }, post, { new: true }).lean();
    if (!updated) throw new Error("Art not found");
    return updated as ArtPost;
  }

  async delete(id: string): Promise<void> {
    await ArtPostModel.deleteOne({ id });
  }
}
