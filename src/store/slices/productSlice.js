import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/products/get`

// Thunk for Featured Products
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch products")
      }

      return data.data.products // ✅ updated to access nested products array
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong")
    }
  }
)

// Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    featuredProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false
        state.featuredProducts = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export default productSlice.reducer
