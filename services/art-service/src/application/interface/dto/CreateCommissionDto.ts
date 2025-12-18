export interface CreateCommissionDto {
  requesterId: string;
  artistId: string;
  title: string;
  description: string;
  referenceImages?: string[];
  budget: number;
  deadline: Date;
}
