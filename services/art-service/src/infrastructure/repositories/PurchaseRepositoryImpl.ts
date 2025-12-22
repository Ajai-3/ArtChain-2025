import { injectable } from "inversify";
import { Purchase } from "../../domain/entities/Purchase";
import { IPurchaseRepository } from "../../domain/repositories/IPurchaseRepository";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { PurchaseModel } from "../models/PurchaseModel";

@injectable()
export class PurchaseRepositoryImpl
  extends BaseRepositoryImpl<Purchase>
  implements IPurchaseRepository
{
  constructor() {
    super(PurchaseModel);
  }

  async findByUserAndArt(userId: string, artId: string): Promise<Purchase | null> {
    const purchase = await PurchaseModel.findOne({ userId, artId });
    return purchase ? purchase.toObject() : null;
  }

  async findByArtId(artId: string): Promise<Purchase | null> {
     const purchase = await PurchaseModel.findOne({ artId }); 
     return purchase ? purchase.toObject() : null;
  }
}
