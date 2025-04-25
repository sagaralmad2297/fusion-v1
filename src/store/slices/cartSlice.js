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
import axiosInstance from "../../utils/api";
import { toast } from "react-toastify";

// Helper function to calculate cart totals
const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { subtotal, totalItems };
};

// Fetch cart items with prices
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/cart");
    return {
      items: res.data.data.items,
      ...calculateTotals(res.data.data.items)
    };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch cart");
  }
});

// Add item to cart with price
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/cart/add", {
        productId, quantity, size
      });
      toast.success(res.data.message);
      return {
        items: res.data.data.items,
        ...calculateTotals(res.data.data.items)
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Add to cart failed"
      );
    }
  }
);

// Update cart item with price
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
      
      // Return updated items and totals
      return {
        items: res.data.data.items,
        ...calculateTotals(res.data.data.items)
      };
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
      
      // Return updated items and totals
      return {
        items: res.data.data.items,
        ...calculateTotals(res.data.data.items)
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// Clear cart
export const clearCartThunk = createAsyncThunk(
  "cart/clearCartThunk",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/cart/clear");
      toast.info(res.data.message);
      return {
        items: [],
        subtotal: 0,
        totalItems: 0
      };
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
    subtotal: 0,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
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
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.totalItems = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;