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

  async findRecent(limit: number): Promise<Commission[]> {
    const docs = await CommissionModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
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
  async getStats(startDate?: Date, endDate?: Date): Promise<{
    REQUESTED: number;
    NEGOTIATING: number;
    AGREED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
    REJECTED: number;
    totalRevenue: number;
    activeDisputes: number;
  }> {
    const query: any = {};
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
    }

    const [requested, negotiating, agreed, in_progress, completed, cancelled, disputes, revenueResult] = await Promise.all([
      CommissionModel.countDocuments({ ...query, status: 'REQUESTED' }),
      CommissionModel.countDocuments({ ...query, status: 'NEGOTIATING' }),
      CommissionModel.countDocuments({ ...query, status: 'AGREED' }),
      CommissionModel.countDocuments({ ...query, status: 'IN_PROGRESS' }),
      CommissionModel.countDocuments({ ...query, status: 'COMPLETED' }),
      CommissionModel.countDocuments({ ...query, status: 'CANCELLED' }),
      CommissionModel.countDocuments({ ...query, status: 'DISPUTE_RAISED' }),
      CommissionModel.aggregate([
        { $match: { ...query, status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: "$platformFee" } } }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return { 
        REQUESTED: requested, 
        NEGOTIATING: negotiating, 
        AGREED: agreed, 
        IN_PROGRESS: in_progress, 
        COMPLETED: completed, 
        CANCELLED: cancelled, 
        REJECTED: 0,
        activeDisputes: disputes,
        totalRevenue
    };
  }
}
