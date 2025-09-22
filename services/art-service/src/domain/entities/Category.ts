export type CategoryStatus = "active" | "inactive"

export class Category {
  constructor(
    public readonly name: string,
    public readonly count: number,
    public readonly status: CategoryStatus = "active",
    public readonly createdAt?: Date, 
    public readonly updatedAt?: Date
  ) {}
}
