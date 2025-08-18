import { GetAllUsersQueryDTO } from './../../../domain/dtos/admin/GetAllUsersQueryDTO';
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";

export class GetAllUsersUseCase {
    constructor(private userRepo: IUserRepository) {}

    async execute(query: GetAllUsersQueryDTO): Promise<any> {
        
    }
}