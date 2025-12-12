import mongoose from "mongoose";
import { AIConfigModel } from "../infrastructure/models/AIConfigModel";
import { config } from "../infrastructure/config/env";

const seedAIConfigs = async () => {
  try {
    await mongoose.connect(config.mongo_url as string);
    console.log("Connected to MongoDB");

    // Check if configs already exist
    const existingConfigs = await AIConfigModel.find();
    if (existingConfigs.length > 0) {
      console.log("AI configs already exist. Skipping seed.");
      process.exit(0);
    }

    const configs = [
      {
        provider: "pollinations",
        displayName: "Pollinations.ai",
        enabled: true,
        isFree: true,
        dailyFreeLimit: 5,
        artcoinCostPerImage: 0,
        defaultModel: "flux",
        availableModels: ["flux", "flux-realism", "flux-anime", "flux-3d", "turbo"],
        maxPromptLength: 1000,
        allowedResolutions: ["512x512", "768x768", "1024x1024", "1152x896", "896x1152"],
        maxImageCount: 4,
        defaultSteps: 30,
        defaultGuidanceScale: 7.5,
        priority: 1,
        apiKey: "" // No API key needed for Pollinations
      },
      {
        provider: "puter",
        displayName: "Puter.js AI",
        enabled: false,
        isFree: true,
        dailyFreeLimit: 3,
        artcoinCostPerImage: 5,
        defaultModel: "default",
        availableModels: ["default"],
        maxPromptLength: 500,
        allowedResolutions: ["512x512", "1024x1024"],
        maxImageCount: 2,
        defaultSteps: 20,
        defaultGuidanceScale: 7.0,
        priority: 2,
        apiKey: "" // TODO: Admin needs to add API key
      },
      {
        provider: "gemini",
        displayName: "Google Gemini",
        enabled: false,
        isFree: false,
        dailyFreeLimit: 0,
        artcoinCostPerImage: 10,
        defaultModel: "gemini-pro-vision",
        availableModels: ["gemini-pro-vision"],
        maxPromptLength: 2000,
        allowedResolutions: ["1024x1024"],
        maxImageCount: 1,
        defaultSteps: 50,
        defaultGuidanceScale: 8.0,
        priority: 3,
        apiKey: "" // TODO: Admin needs to add API key
      }
    ];

    await AIConfigModel.insertMany(configs);
    console.log("✅ AI configs seeded successfully!");
    console.log(`   - Pollinations.ai: ENABLED (Free - 5/day)`);
    console.log(`   - Puter.js: DISABLED (Need API key)`);
    console.log(`   - Gemini: DISABLED (Need API key)`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding AI configs:", error);
    process.exit(1);
  }
};

seedAIConfigs();
