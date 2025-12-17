import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PlatformConfig {
  artCoinRate: number;
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  commissionArtPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
}

const initialState: PlatformConfig = {
  artCoinRate: 10,
  auctionCommissionPercentage: 0,
  artSaleCommissionPercentage: 0,
  commissionArtPercentage: 0,
  welcomeBonus: 0,
  referralBonus: 0,
};

const platformSlice = createSlice({
  name: "platform",
  initialState,
  reducers: {
    setPlatformConfig: (state, action: PayloadAction<Partial<PlatformConfig>>) => {
      if (action.payload.artCoinRate !== undefined) state.artCoinRate = action.payload.artCoinRate;
      if (action.payload.auctionCommissionPercentage !== undefined) state.auctionCommissionPercentage = action.payload.auctionCommissionPercentage;
      if (action.payload.artSaleCommissionPercentage !== undefined) state.artSaleCommissionPercentage = action.payload.artSaleCommissionPercentage;
      if (action.payload.commissionArtPercentage !== undefined) state.commissionArtPercentage = action.payload.commissionArtPercentage;
      if (action.payload.welcomeBonus !== undefined) state.welcomeBonus = action.payload.welcomeBonus;
      if (action.payload.referralBonus !== undefined) state.referralBonus = action.payload.referralBonus;
    },
  },
});

export const { setPlatformConfig } = platformSlice.actions;
export default platformSlice.reducer;
