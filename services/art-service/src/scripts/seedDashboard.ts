
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ArtPostModel } from '../infrastructure/models/ArtPostModel';
import { AuctionModel } from '../infrastructure/models/AuctionModel';
import { CommissionModel } from '../infrastructure/models/CommissionModel';
import { CategoryModel } from '../infrastructure/models/CategoryModel';

dotenv.config();

const USER_1 = 'cmexta8ae0000bs8ktuvvq5qd';
const USER_2 = 'cmf6luw8t0000bsz8s7fhj3hh';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/art-service';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  try {
    // Clear existing data (Optional: comment out if you want to append)
    // await ArtPostModel.deleteMany({});
    // await AuctionModel.deleteMany({});
    // await CommissionModel.deleteMany({});
    // await CategoryModel.deleteMany({});

    console.log('Seeding Categories...');
    const categories = ['Painting', 'Digital Art', 'Sculpture', 'Photography', 'AI Art'];
    const categoryDocs = [];
    for (const cat of categories) {
      let category = await CategoryModel.findOne({ name: cat });
      if (!category) {
        // Note: CategoryModel only uses name and status
        category = await CategoryModel.create({ 
            name: cat, 
            status: 'active'
        });
      }
      categoryDocs.push(category);
    }

    console.log('Seeding ArtPosts...');
    const arts = [];
    for (let i = 0; i < 20; i++) {
      const isSold = i % 3 === 0;
      const artistId = i % 2 === 0 ? USER_1 : USER_2;
      const priceType = 'artcoin'; 
      
      const art = await ArtPostModel.create({
        userId: artistId, // Mapped from artistId to userId as per schema
        title: `Artwork ${i + 1}`,
        artName: `artwork-${Date.now()}-${i}`, // Required unique field
        description: `This is a masterpiece number ${i + 1}`,
        artType: 'Digital', // Required
        priceType: priceType,
        artcoins: Math.floor(Math.random() * 400) + 50,
        fiatPrice: null,
        
        previewUrl: `https://picsum.photos/seed/${i}/400/400`, // Mapped from image to previewUrl
        watermarkedUrl: `https://picsum.photos/seed/${i}/400/400?blur=2`, // Required
        aspectRatio: "1:1", // Required

        isForSale: !isSold,
        isSold: isSold,
        // purchaserId not in ArtPost schema, handled via Purchase model usually, but keeping logic clean
        
        hashtags: ['art', 'modern', 'seed'],
        postType: 'original',
        status: 'active',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
      });
      arts.push(art);
    }

    console.log('Seeding Auctions...');
    for (let i = 0; i < 10; i++) {
        const isActive = i < 5;
        const hostId = i % 2 === 0 ? USER_1 : USER_2;
        const artwork = arts[i]; // Use some arts for auctions
        
        await AuctionModel.create({
            title: `Auction for ${artwork.title}`,
            description: `Bidding for ${artwork.title}`,
            startPrice: artwork.artcoins || 100,
            currentBid: isActive ? (artwork.artcoins || 100) + 50 : (artwork.artcoins || 100) + 200,
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Started 7 days ago
            endTime: isActive 
                ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // Ends in 2 days
                : new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Ended 1 day ago
            hostId: hostId,
            imageKey: artwork.previewUrl, // Required by AuctionModel
            // artPostId not in AuctionModel schema provided, assuming it might be linked via description or we just omit it if not there
            // The provided AuctionModel schema has: hostId, title, description, imageKey, startPrice, currentBid, startTime, endTime, status, winnerId, bids
            // It does NOT have artPostId.
            
            status: isActive ? 'ACTIVE' : 'ENDED',
            winnerId: isActive ? null : (hostId === USER_1 ? USER_2 : USER_1),
            // winnerBid field not in schema, ignoring
            // participants field not in schema, ignoring
            // bids is a ref array
            bids: []
        });
    }

    console.log('Seeding Commissions...');
    const statuses = ['REQUESTED', 'AGREED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    for (let i = 0; i < 10; i++) {
        const artistId = i % 2 === 0 ? USER_1 : USER_2;
        const requesterId = artistId === USER_1 ? USER_2 : USER_1;
        const status = statuses[i % statuses.length];

        await CommissionModel.create({
            artistId: artistId,
            requesterId: requesterId, // Mapped from clientId
            conversationId: `conv_${i}`,
            title: 'Commission Request',
            description: 'A beautiful portrait',
            budget: 150 + i * 10, // Mapped from price
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            status: status,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
        });
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
