import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Bid {
  id: string;
  amount: number;
  bidderId: string;
  createdAt: string;
}

interface BiddingState {
  activeAuctionId: string | null;
  bids: Bid[];
  currentHighestBid: number;
  loading: boolean;
  error: string | null;
}

const initialState: BiddingState = {
  activeAuctionId: null,
  bids: [],
  currentHighestBid: 0,
  loading: false,
  error: null,
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
    clearBiddingState: (state) => {
        state.activeAuctionId = null;
        state.bids = [];
        state.currentHighestBid = 0;
    }
  },
});

export const { setActiveAuction, setBids, addBid, updateHighestBid, clearBiddingState } = biddingSlice.actions;
export default biddingSlice.reducer;
