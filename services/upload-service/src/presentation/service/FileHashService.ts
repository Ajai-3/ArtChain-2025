import crypto from "crypto";

export class FileHashService {
  static generateHash(fileBuffer: Buffer): string {
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
  }
}
