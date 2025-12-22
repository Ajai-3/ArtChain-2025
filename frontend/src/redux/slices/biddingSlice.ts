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
      // Avoid duplicate bids (e.g., from re-renders or double socket events)
      if (state.bids.some(b => b.id === action.payload.id)) {
          return;
      }
      state.bids.unshift(action.payload);
      if (action.payload.amount > state.currentHighestBid) {
        state.currentHighestBid = action.payload.amount;
      }
      if (state.activeAuction && action.payload.amount > state.activeAuction.currentBid) {
          state.activeAuction.currentBid = action.payload.amount;
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
        // Sync bids and highest bid if included
        if (action.payload.bids && action.payload.bids.length > 0) {
            state.bids = action.payload.bids;
            state.currentHighestBid = Math.max(...action.payload.bids.map(b => b.amount));
        } else if (action.payload.bids) {
            // connection payload has empty bids
            state.bids = [];
            state.currentHighestBid = 0;
        } else {
             // If bids not provided, use currentBid from auction object if available as fallback, or keep 0
             state.currentHighestBid = action.payload.currentBid || 0;
        }
    },
    clearBiddingState: (state) => {
        state.activeAuctionId = null;
        state.activeAuction = null;
        state.bids = [];
        state.currentHighestBid = 0;
    },
    auctionEnded: (state, action: PayloadAction<{ auctionId: string, status: string, winnerId?: string, winningBidAmount?: number }>) => {
        if (state.activeAuction && state.activeAuction.id === action.payload.auctionId) {
            state.activeAuction.status = action.payload.status as any;
            if (action.payload.winnerId) {
                state.activeAuction.winnerId = action.payload.winnerId;
            }
            if (action.payload.winningBidAmount) {
                 state.activeAuction.currentBid = action.payload.winningBidAmount;
                 state.currentHighestBid = action.payload.winningBidAmount;
            }
        }
        // Update in list if present
        const auctionInList = state.auctions.find(a => a.id === action.payload.auctionId);
        if (auctionInList) {
             auctionInList.status = action.payload.status as any;
             if (action.payload.winnerId) {
                auctionInList.winnerId = action.payload.winnerId;
             }
        }
    }
  },
});

export const { setActiveAuction, setBids, addBid, updateHighestBid, setAuctions, setActiveAuctionData, clearBiddingState, auctionEnded } = biddingSlice.actions;
export default biddingSlice.reducer;
