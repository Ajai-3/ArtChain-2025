import { injectable } from "inversify";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Commission } from "../../domain/entities/Commission";
import { CommissionModel } from "../models/CommissionModel";
import { ICommissionRepository } from "../../domain/repositories/ICommissionRepository";

@injectable()
export class CommissionRepositoryImpl
  extends BaseRepositoryImpl<Commission>
  implements ICommissionRepository
{
  constructor() {
    super(CommissionModel);
  }

  async findByConversationId(conversationId: string): Promise<Commission | null> {
    const doc = await CommissionModel.findOne({ conversationId }).sort({ createdAt: -1 }).lean();
    return (doc as unknown) as Commission | null;
  }

  async findAllByConversationId(conversationId: string): Promise<Commission[]> {
    const docs = await CommissionModel.find({ conversationId }).sort({ createdAt: -1 }).lean();
    return (docs as unknown) as Commission[];
  }

  async findByRequesterId(requesterId: string): Promise<Commission[]> {
    const docs = await CommissionModel.find({ requesterId }).sort({ createdAt: -1 }).lean();
    return (docs as unknown) as Commission[];
  }

  async findByArtistId(artistId: string): Promise<Commission[]> {
    const docs = await CommissionModel.find({ artistId }).sort({ createdAt: -1 }).lean();
    return (docs as unknown) as Commission[];
  }

  async findByStatus(status: string): Promise<Commission[]> {
    const docs = await CommissionModel.find({ status }).sort({ createdAt: -1 }).lean();
    return (docs as unknown) as Commission[];
  }

  async findAllFiltered(filter: any, page: number, limit: number): Promise<{ commissions: Commission[], total: number }> {
    const query = CommissionModel.find(filter);
    const total = await CommissionModel.countDocuments(filter);
    const docs = await query
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    
    return {
        commissions: (docs as unknown) as Commission[],
        total
    };
  }
}
