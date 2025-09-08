import sharp from "sharp";
import fs from "fs";
import path from "path";

export interface WatermarkResult {
  previewBuffer: Buffer;
  watermarkedBuffer: Buffer;
  localFiles: {
    original: string;
    preview: string;
    watermarked: string;
  };
}

export class WatermarkService {
  static async processAndSave(
    fileBuffer: Buffer,
    userId: string,
    fileName: string,
    baseFolder = "temp-art",
    watermarkText = "Artchain"
  ): Promise<WatermarkResult> {
    const image = sharp(fileBuffer);
    const metadata = await image.metadata();
    const width = metadata.width ?? 800;
    const height = metadata.height ?? 600;


    const fontSize = Math.floor(Math.min(width, height) * 0.2);

    const watermarkSvg = `
  <svg width="${width}" height="${height}">
    <style>
      text {
        font-family: cursive;
        font-size: ${fontSize}px;
        fill: white;
        opacity: 0.25;
      }
    </style>
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
    >
      ${watermarkText}
    </text>
  </svg>
`;

    const previewBuffer = await image.jpeg({ quality: 80 }).toBuffer();
    const watermarkedBuffer = await image
      .composite([{ input: Buffer.from(watermarkSvg) }])
      .jpeg({ quality: 80 })
      .toBuffer();

    const localFolder = path.join(process.cwd(), baseFolder, userId);
    if (!fs.existsSync(localFolder)) {
      fs.mkdirSync(localFolder, { recursive: true });
    }

    const timestamp = Date.now();
    const originalFile = path.join(
      localFolder,
      `original_${timestamp}_${fileName}`
    );
    const previewFile = path.join(
      localFolder,
      `preview_${timestamp}_${fileName}`
    );
    const watermarkedFile = path.join(
      localFolder,
      `watermarked_${timestamp}_${fileName}`
    );

    fs.writeFileSync(originalFile, fileBuffer);
    fs.writeFileSync(previewFile, previewBuffer);
    fs.writeFileSync(watermarkedFile, watermarkedBuffer);

    return {
      previewBuffer,
      watermarkedBuffer,
      localFiles: {
        original: originalFile,
        preview: previewFile,
        watermarked: watermarkedFile,
      },
    };
  }
}
