import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (!existingItem) {
        state.items.push(action.payload)
        localStorage.setItem("wishlist", JSON.stringify(state.items))
        toast.success("Added to wishlist")
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem("wishlist", JSON.stringify(state.items))
      toast.info("Removed from wishlist")
    },

    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem("wishlist")
    },
  },
})

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

