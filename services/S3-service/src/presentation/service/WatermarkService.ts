import sharp from "sharp";

export interface WatermarkResult {
  previewBuffer: Buffer;
  watermarkedBuffer: Buffer;
}

export class WatermarkService {
  static async process(
    fileBuffer: Buffer,
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

    const previewBuffer = await image.jpeg({ quality: 30 }).toBuffer();
    const watermarkedBuffer = await image
      .composite([{ input: Buffer.from(watermarkSvg) }])
      .jpeg({ quality: 30 })
      .toBuffer();

    return { previewBuffer, watermarkedBuffer };
  }
}