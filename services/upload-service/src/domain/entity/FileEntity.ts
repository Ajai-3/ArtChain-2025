export class FileEntity {
  constructor(
    public url: string,
    public ownerId: string,
    public category: 'profile' | 'banner' | 'art',
    public size: number,
    public mimeType: string
  ) {}
}