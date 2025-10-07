import Role from "@prisma/client";
import { injectable } from "inversify";
import { prisma } from "../../db/prisma";
import { BaseRepositoryImpl } from "../BaseRepositoryImpl";
import { SafeUser } from "../../../domain/repositories/IBaseRepository";
import { IAdminRepositories } from "../../../domain/repositories/admin/IAdminRepository";

@injectable()
export class AdminRepositoryImpl
  extends BaseRepositoryImpl
  implements IAdminRepositories
{
  protected model = prisma.user;
}
