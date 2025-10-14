import { DeleteImageRequestDTO } from "../dto/DeleteImageRequestDTO";

export interface IDeleteImageUseCase {
    execute(request: DeleteImageRequestDTO): Promise<void>
}