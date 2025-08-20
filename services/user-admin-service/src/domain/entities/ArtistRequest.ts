export class ArtistRequest {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: 'pending' | 'approved' | 'rejected' = 'pending',
    public readonly rejectionReason: string | null = null,
    public readonly createdAt: Date = new Date(),
    public readonly reviewedAt: Date | null = null
  ) {}
}
