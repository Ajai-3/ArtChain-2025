import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Auction, Bid } from "../../types/auction";

interface BiddingState {
  activeAuctionId: string | null;
  activeAuction: Auction | null;
  bids: Bid[];
  currentHighestBid: number;
  loading: boolean;
  error: string | null;
  auctions: Auction[];
}

const initialState: BiddingState = {
  activeAuctionId: null,
  activeAuction: null,
  bids: [],
  currentHighestBid: 0,
  loading: false,
  error: null,
  auctions: [],
};

const biddingSlice = createSlice({
  name: "bidding",
  initialState,
  reducers: {
    setActiveAuction: (state, action: PayloadAction<string>) => {
      state.activeAuctionId = action.payload;
      state.bids = [];
      state.currentHighestBid = 0;
    },
    setBids: (state, action: PayloadAction<Bid[]>) => {
      state.bids = action.payload;
      if (action.payload.length > 0) {
        state.currentHighestBid = Math.max(...action.payload.map(b => b.amount));
      }
    },
    addBid: (state, action: PayloadAction<Bid>) => {
      state.bids.unshift(action.payload);
      if (action.payload.amount > state.currentHighestBid) {
        state.currentHighestBid = action.payload.amount;
      }
    },
    updateHighestBid: (state, action: PayloadAction<number>) => {
        state.currentHighestBid = action.payload;
    },
    setAuctions: (state, action: PayloadAction<Auction[]>) => {
        state.auctions = action.payload;
    },
    setActiveAuctionData: (state, action: PayloadAction<Auction>) => {
        state.activeAuction = action.payload;
        state.activeAuctionId = action.payload.id;
        // Optionally sync bids if included
        if (action.payload.bids) {
            state.bids = action.payload.bids;
        }
    },
    clearBiddingState: (state) => {
        state.activeAuctionId = null;
        state.activeAuction = null;
        state.bids = [];
        state.currentHighestBid = 0;
    }
  },
});

export const { setActiveAuction, setBids, addBid, updateHighestBid, setAuctions, setActiveAuctionData, clearBiddingState } = biddingSlice.actions;
export default biddingSlice.reducer;
