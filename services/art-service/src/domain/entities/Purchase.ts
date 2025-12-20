export class Purchase {
  constructor(
    public readonly userId: string,
    public readonly artId: string,
    public readonly sellerId: string,
    public readonly amount: number,
    public readonly transactionId: string,
    public readonly purchaseDate: Date = new Date()
  ) {}
}
