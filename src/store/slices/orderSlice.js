import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock orders data
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-2023-001",
    userId: "1",
    items: [
      {
        product: {
          id: "1",
          name: "Classic Denim Jacket",
          image: "https://via.placeholder.com/300",
        },
        quantity: 1,
        price: 89.99,
        selectedSize: "M",
        selectedColor: "blue",
      },
      {
        product: {
          id: "4",
          name: "Slim Fit Chino Pants",
          image: "https://via.placeholder.com/300",
        },
        quantity: 2,
        price: 49.99,
        selectedSize: "32",
        selectedColor: "khaki",
      },
    ],
    shippingAddress: {
      firstName: "Test",
      lastName: "User",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "123-456-7890",
    },
    paymentMethod: "credit-card",
    subtotal: 189.97,
    shipping: 0,
    tax: 15.2,
    total: 205.17,
    status: "delivered",
    createdAt: "2023-03-15T00:00:00.000Z",
    updatedAt: "2023-03-18T00:00:00.000Z",
  },
  {
    id: "2",
    orderNumber: "ORD-2023-002",
    userId: "1",
    items: [
      {
        product: {
          id: "5",
          name: "Women's Running Shoes",
          image: "https://via.placeholder.com/300",
        },
        quantity: 1,
        price: 129.99,
        selectedSize: "8",
        selectedColor: "pink",
      },
    ],
    shippingAddress: {
      firstName: "Test",
      lastName: "User",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "123-456-7890",
    },
    paymentMethod: "paypal",
    subtotal: 129.99,
    shipping: 0,
    tax: 10.4,
    total: 140.39,
    status: "processing",
    createdAt: "2023-04-10T00:00:00.000Z",
    updatedAt: "2023-04-10T00:00:00.000Z",
  },
]

// Async thunks
export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (userId) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockOrders.filter((order) => order.userId === userId)
})

export const createOrder = createAsyncThunk("orders/createOrder", async (orderData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const newOrder = {
    id: Date.now().toString(),
    orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
    ...orderData,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would be saved to a database
  mockOrders.push(newOrder)

  return newOrder
})

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.orders.push(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default orderSlice.reducer

