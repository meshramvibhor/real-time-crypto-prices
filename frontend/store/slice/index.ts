import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type CryptoEntry = {
  _id: string;
  symbol: string;
  price: number;
  timestamp: Date;
  __v: number;
};

export interface CryptoState {
  latestEntries: {
    [key: string]: CryptoEntry[];
  };
}

// Initial state is empty
const initialState: CryptoState = {
  latestEntries: {},
};

export const cryptoEntrySlice = createSlice({
  name: "cryptoEntry",
  initialState,
  reducers: {
    setEntries: (state, action: PayloadAction<{ [key: string]: CryptoEntry[] }>) => {
      state.latestEntries = action.payload;
    },
    add: (state, action: PayloadAction<{ [key: string]: CryptoEntry[] }>) => {
      // Save to localStorage if in client environment
      if (typeof window !== 'undefined') {
        localStorage.setItem("cryptoEntry", JSON.stringify(action.payload));
      }
      state.latestEntries = action.payload;
    },
  },
});

export const { setEntries, add } = cryptoEntrySlice.actions;

// Thunk to load entries from localStorage
export const loadEntriesFromLocalStorage = () => (dispatch: any) => {
  if (typeof window !== 'undefined') {
    const savedEntries = localStorage.getItem("cryptoEntry");
    const initialEntries = savedEntries ? JSON.parse(savedEntries) : {};
    dispatch(setEntries(initialEntries));
  }
};

export default cryptoEntrySlice.reducer;
