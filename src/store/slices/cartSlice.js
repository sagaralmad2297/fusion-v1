import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

const initialState = {
  items: JSON.parse(localStorage.getItem("cart")) || [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity = 1 } = action.payload
      const existingItem = state.items.find((item) => item.id === id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push(action.payload)
      }

      localStorage.setItem("cart", JSON.stringify(state.items))
      toast.success("Added to cart")
    },

    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find((item) => item.id === id)

      if (item) {
        item.quantity = quantity
      }

      localStorage.setItem("cart", JSON.stringify(state.items))
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      localStorage.setItem("cart", JSON.stringify(state.items))
      toast.info("Removed from cart")
    },

    clearCart: (state) => {
      state.items = []
      localStorage.removeItem("cart")
    },
  },
})

export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer

