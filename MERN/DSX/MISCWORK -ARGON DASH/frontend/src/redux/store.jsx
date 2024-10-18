import { configureStore } from '@reduxjs/toolkit'
import productsSlice from "./Slice/productsSlice"


export const store = configureStore({
  reducer: {
    allProducts:productsSlice,
    },
})