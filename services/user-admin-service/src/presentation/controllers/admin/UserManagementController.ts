import { IAdminRepositories } from "../../../domain/repositories/admin/IAdminRepository";

export class UserManageMentController {
  constructor(private readonly adminRepo: IAdminRepositories) {}

  //# ================================================================================================================
  //# GET ALL USERS
  //# ================================================================================================================
  //# GET /api/v1/admin/users
  //# Request body: { (email: string or username: string), password: string }
  //# This controller allows admin to login using their (email or username) and password.
  //# ================================================================================================================
}
