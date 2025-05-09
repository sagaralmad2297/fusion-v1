import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api";
import { toast } from "react-toastify";

// Fetch wishlist items
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/wishlist");
      return {
        items: res.data.data.products || [],
        totalItems: res.data.data.pagination?.totalItems || 0
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// Add item to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/wishlist/add", { productId });
      toast.success(res.data.message);
      return {
        item: res.data.data.product,
        totalItems: res.data.data.totalItems
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Add to wishlist failed"
      );
    }
  }
);

// Remove item from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      toast.info(res.data.message);
      return {
        productId,
        totalItems: res.data.data.totalItems
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Remove from wishlist failed"
      );
    }
  }
);

// Clear wishlist
export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.delete("/wishlist/clear");
      toast.info(res.data.message);
      return {
        totalItems: 0
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear wishlist");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Clear wishlist failed"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Manual clear if needed
    resetWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // Check if product already exists
        const exists = state.items.some(item => item._id === action.payload.item._id);
        if (!exists) {
          state.items.push(action.payload.item);
          state.totalItems = action.payload.totalItems;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload.productId);
        state.totalItems = action.payload.totalItems;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear wishlist
      .addCase(clearWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalItems = 0;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistTotalItems = (state) => state.wishlist.totalItems;
export const selectIsInWishlist = (productId) => (state) => 
  state.wishlist.items.some(item => item._id === productId);

export default wishlistSlice.reducer;