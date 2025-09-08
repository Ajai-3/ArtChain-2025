import imghash from "imghash";

export class FileHashService {
  static async generateHash(fileBuffer: Buffer): Promise<string> {
    const hash = await imghash.hash(fileBuffer, 16, "hex");
    return hash;
  }
}
