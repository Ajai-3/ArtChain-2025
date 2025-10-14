export class FileEntity {
  constructor(
    public url: string,
    public ownerId: string,
    public category: 'profile' | 'banner' | 'art' | 'backgound',
    public size: number,
    public mimeType: string
  ) {}
}