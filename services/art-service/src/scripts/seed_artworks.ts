import { connectDB } from "../infrastructure/config/db";
import { ArtPostModel } from "../infrastructure/models/ArtPostModel";
import { PurchaseModel } from "../infrastructure/models/PurchaseModel";
import mongoose from "mongoose";

const CREATOR_ID = "cmexta8ae0000bs8ktuvvq5qd";
const PURCHASER_ID = "cmf6luw8t0000bsz8s7fhj3hh";

const generateSoldArt = (index: number) => ({
  userId: CREATOR_ID,
  title: `Sold Art ${index + 1}`,
  artName: `sold-art-${Date.now()}-${index + 1}`,
  description: `This is a sold artwork number ${index + 1}`,
  artType: "Digital",
  hashtags: ["sold", "art", "exclusive"],
  previewUrl: `https://picsum.photos/seed/${Date.now() + index}/400/600`,
  watermarkedUrl: `https://picsum.photos/seed/${Date.now() + index}/400/600?blur=2`,
  aspectRatio: "2:3",
  commentingDisabled: false,
  downloadingDisabled: false,
  isPrivate: false,
  isSensitive: false,
  isForSale: true,
  isSold: true, 
  priceType: "artcoin",
  artcoins: Math.floor(Math.random() * 100) + 10,
  fiatPrice: null,
  postType: "original",
  status: "active"
});

async function seedSoldArtworks() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    
    console.log(`Seeding 3 SOLD artworks for creator ${CREATOR_ID} and purchaser ${PURCHASER_ID}...`);
    
    const purchases = [];
    const artworks = [];

    for (let i = 0; i < 3; i++) {
        const art = generateSoldArt(i);
        // We need the ID for the purchase record, so we create the object first
        const artDoc = new ArtPostModel(art);
        artworks.push(artDoc);

        purchases.push({
            userId: PURCHASER_ID, // Buyer
            artId: artDoc._id,
            sellerId: CREATOR_ID,
            amount: art.artcoins,
            transactionId: `tx-${Date.now()}-${i}`,
            purchaseDate: new Date()
        });
    }

    await ArtPostModel.insertMany(artworks);
    await PurchaseModel.insertMany(purchases);
    
    console.log("✅ Successfully seeded 3 SOLD artworks and Purchase records directly to DB.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedSoldArtworks();
