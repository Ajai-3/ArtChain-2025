import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { logout } from "./userSlice";

interface Transaction {
  id: number;
  date: string;
  type: "Earned" | "Spent";
  amount: number;
}

interface WalletState {
  balance: number;
  inrValue: number;
  lockedAmount: number;
  quickStats: {
    earned: number;
    spent: number;
    avgTransaction: number;
    roi: string;
    grade: string;
  };
  transactionSummary: {
    earned: number;
    spent: number;
    netGain: number;
  };
  transactions: Transaction[];
}

const initialState: WalletState = {
  balance: 0,
  inrValue: 0,
  lockedAmount: 0,
  quickStats: { earned: 0, spent: 0, avgTransaction: 0, roi: "0%", grade: "-" },
  transactionSummary: { earned: 0, spent: 0, netGain: 0 },
  transactions: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletData: (state, action: PayloadAction<WalletState>) => {
      return { ...state, ...action.payload };
    },
    updateBalanceAndLocked: (state, action: PayloadAction<{ balance: number; lockedAmount: number }>) => {
      state.balance = action.payload.balance;
      state.lockedAmount = action.payload.lockedAmount;
      state.inrValue = action.payload.balance * 10; // Update INR value as well
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
     builder.addCase(logout, () => initialState);
   },
});

export const { setWalletData, updateBalanceAndLocked, addTransaction } = walletSlice.actions;
export default walletSlice.reducer;
