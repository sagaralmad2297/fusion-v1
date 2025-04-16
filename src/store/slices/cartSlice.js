// import { createSlice } from "@reduxjs/toolkit"
// import { toast } from "react-toastify"

// const initialState = {
//   items: JSON.parse(localStorage.getItem("cart")) || [],
// }

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const { id, quantity = 1 } = action.payload
//       const existingItem = state.items.find((item) => item.id === id)

//       if (existingItem) {
//         existingItem.quantity += quantity
//       } else {
//         state.items.push(action.payload)
//       }

//       localStorage.setItem("cart", JSON.stringify(state.items))
//       toast.success("Added to cart")
//     },

//     updateCartItem: (state, action) => {
//       const { id, quantity } = action.payload
//       const item = state.items.find((item) => item.id === id)

//       if (item) {
//         item.quantity = quantity
//       }

//       localStorage.setItem("cart", JSON.stringify(state.items))
//     },

//     removeFromCart: (state, action) => {
//       state.items = state.items.filter((item) => item.id !== action.payload)
//       localStorage.setItem("cart", JSON.stringify(state.items))
//       toast.info("Removed from cart")
//     },

//     clearCart: (state) => {
//       state.items = []
//       localStorage.removeItem("cart")
//     },
//   },
// })

// export const { addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions
// export default cartSlice.reducer

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import axiosInstance from "../../utils/api";

// import { toast } from "react-toastify";

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// // Thunks
// export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
//   try {
//     const res = await axios.get(`${API_BASE_URL}/cart`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     return res.data.data.items;
//   } catch (err) {
//     return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch cart");
//   }
// });

// export const addToCart = createAsyncThunk(
//   "cart/addToCart",
//   async ({ productId, quantity, size }, thunkAPI) => {
//     console.log("Adding to cart:", productId, quantity, size);
//     try {
//       const res = await axios.post(
//         `${API_BASE_URL}/cart/add`,
//         { productId, quantity, size },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success(res.data.message);
//       return res.data.data.items;
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add to cart");
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message || "Add to cart failed"
//       );
//     }
//   }
// );

// export const updateCartItem = createAsyncThunk("cart/updateCartItem", async ({ productId, quantity }, thunkAPI) => {
//   console.log("prrrrrrrrrrr",productId)
//   try {
//     const res = await axios.put(`${API_BASE_URL}/cart/update`, { productId, quantity }, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     toast.success(res.data.message);
//     return res.data.data.items;
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Failed to update cart");
//     return thunkAPI.rejectWithValue(err.response?.data?.message);
//   }
// });

// export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, thunkAPI) => {
//   try {
//     const res = await axios.delete(`${API_BASE_URL}/cart/delete/${productId}`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });
//     toast.info(res.data.message);
//     return productId;
//   } catch (err) {
//     toast.error(err.response?.data?.message || "Failed to remove item");
//     return thunkAPI.rejectWithValue(err.response?.data?.message);
//   }
// });

// // Slice
// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload;
//       })
//       .addCase(fetchCart.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(addToCart.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })
//       .addCase(updateCartItem.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })
//       .addCase(removeFromCart.fulfilled, (state, action) => {
//         state.items = state.items.filter(item => item.productId !== action.payload);
//       });
//   },
// });

// export const { clearCart } = cartSlice.actions;
// export default cartSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api"; // ✅ Use the custom instance
import { toast } from "react-toastify";

// Fetch cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/cart");
    return res.data.data.items;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch cart");
  }
});

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/cart/add", {
        productId, quantity, size
      });
      toast.success(res.data.message);
      return res.data.data.items;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Add to cart failed"
      );
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, size }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/cart/update", {
        productId,
        quantity,
        size,
      });
      toast.success(res.data.message);

      // After successfully updating the cart, fetch the updated cart
      dispatch(fetchCart());

      return res.data.data.items; // Return updated items to update Redux state
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ itemId, size }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/cart/delete/${itemId}/${size}`);
      toast.info(res.data.message);

      // After successfully removing the item, fetch the updated cart
      dispatch(fetchCart());

      return itemId; // Return itemId to remove from Redux state
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Clear cart
export const clearCartThunk = createAsyncThunk(
  "cart/clearCartThunk",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/cart/clear");
      toast.info(res.data.message);

      // If the cart is successfully cleared, fetch the updated cart.
      dispatch(fetchCart());  // Dispatch fetchCart after clearing

      return []; // cart is cleared, so return empty items
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart items
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      
      // Update cart item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
      })
      
      // Clear cart
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
