import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunks
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    // In a real app, this would be an API call
    // Simulating API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (email === "test@example.com" && password === "password") {
      const user = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        phone: "123-456-7890",
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user))

      return user
    }

    return rejectWithValue("Invalid email or password")
  } catch (error) {
    return rejectWithValue(error.message || "Login failed")
  }
})

export const register = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    // In a real app, this would be an API call
    // Simulating API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation - in a real app, check if email already exists
    const user = {
      id: Date.now().toString(),
      name,
      email,
      firstName: name.split(" ")[0],
      lastName: name.split(" ")[1] || "",
      phone: "",
    }

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user))

    return user
  } catch (error) {
    return rejectWithValue(error.message || "Registration failed")
  }
})

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user")
  return null
})

export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
})

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })

      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = !!action.payload
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

