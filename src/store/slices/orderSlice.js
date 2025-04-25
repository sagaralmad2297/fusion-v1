import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api";
import { toast } from "react-toastify";

// 👉 Create Order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ totalAmount, transactionId, paymentStatus, orderStatus, userAddressId, items }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/orders/create", {
        totalAmount,
        transactionId,
        paymentStatus,
        orderStatus,
        userAddressId,
        items,
      });

      toast.success("Order placed successfully!");
      window.location.href = "/orders";
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Order creation failed");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 👉 Fetch All Orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/orders");
    
      return res.data.data;
     
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 👉 Fetch Orders by User
export const fetchOrdersByUser = createAsyncThunk(
  "order/fetchOrdersByUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/orders/user");
      console.log("rseeeeeeee",res.data.data)
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 👉 Get Single Order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch order");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 👉 Update Order (Status or Payment)
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, orderStatus, paymentStatus }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/orders/${orderId}`, {
        orderStatus,
        paymentStatus,
      });
      toast.success("Order updated successfully!");
      return res.data.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 👉 Delete Order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      toast.success("Order deleted successfully!");
      return orderId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

// 👉 Download Invoice
export const downloadInvoice = createAsyncThunk(
  "order/downloadInvoice",
  async (orderId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/orders/invoice/${orderId}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Invoice downloaded!");
      return orderId;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download invoice");
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    orders: [],
    orderPlaced: null,
    orderUpdated: null,
    selectedOrder: null,
    invoiceDownloadStatus: null,
  },
  reducers: {
    clearOrderState: (state) => {
      state.orderPlaced = null;
      state.orderUpdated = null;
      state.selectedOrder = null;
      state.invoiceDownloadStatus = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderPlaced = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Orders by User
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Single Order
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderUpdated = action.payload;
        state.orders = state.orders.map(order =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Download Invoice
      .addCase(downloadInvoice.pending, (state) => {
        state.loading = true;
        state.invoiceDownloadStatus = null;
      })
      .addCase(downloadInvoice.fulfilled, (state) => {
        state.loading = false;
        state.invoiceDownloadStatus = "success";
      })
      .addCase(downloadInvoice.rejected, (state, action) => {
        state.loading = false;
        state.invoiceDownloadStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
