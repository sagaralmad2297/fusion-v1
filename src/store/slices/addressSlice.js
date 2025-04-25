import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../utils/api"; // ✅ Use the custom instance
import axios from 'axios';
import { toast } from "react-toastify";
// Async Thunks to interact with the backend API

// Add Address


export const addAddress = createAsyncThunk(
    "address/addAddress",
    async (addressData, thunkAPI) => {
      console.log("addddddddd", addressData);
      try {
        const res = await axiosInstance.post("/addresses", addressData); // Send data directly
        toast.success(res.data.message);
        return res.data.data
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add to cart");
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || "Add to cart failed"
        );
      }
    }
  );
  

  
  
// Get Address



export const getAddress = createAsyncThunk("address/getAddress", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/addresses");
    console.log("adresssgetttt",res)
    return res.data.data.items;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message || "Failed to fetch cart");
  }
});


// Update Address
export const updateAddress = createAsyncThunk('address/updateAddress', async ({ id, addressData }, { getState, rejectWithValue }) => {
  const { userInfo } = getState().auth;

  try {
    const response = await axiosInstance.put(`/addresses/${id}`, addressData, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete Address
export const deleteAddress = createAsyncThunk('address/deleteAddress', async (id, { getState, rejectWithValue }) => {
  const { userInfo } = getState().auth;

  try {
    const response = await axiosInstance.delete(`/addresses/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    return id;  // Return the id of the deleted address to remove it from state
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    address: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Address
      .addCase(getAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(getAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = action.payload;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.address = null;  // Remove the address from state after delete
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
