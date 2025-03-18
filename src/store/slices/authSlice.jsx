// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// // Async thunks
// export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
//   try {
//     // In a real app, this would be an API call
//     // Simulating API call with timeout
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // Mock validation
//     if (email === "test@example.com" && password === "password") {
//       const user = {
//         id: "1",
//         name: "Test User",
//         email: "test@example.com",
//         firstName: "Test",
//         lastName: "User",
//         phone: "123-456-7890",
//       }

//       // Store user in localStorage
//       localStorage.setItem("user", JSON.stringify(user))

//       return user
//     }

//     return rejectWithValue("Invalid email or password")
//   } catch (error) {
//     return rejectWithValue(error.message || "Login failed")
//   }
// })

// export const register = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
//   try {
//     // In a real app, this would be an API call
//     // Simulating API call with timeout
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // Mock validation - in a real app, check if email already exists
//     const user = {
//       id: Date.now().toString(),
//       name,
//       email,
//       firstName: name.split(" ")[0],
//       lastName: name.split(" ")[1] || "",
//       phone: "",
//     }

//     // Store user in localStorage
//     localStorage.setItem("user", JSON.stringify(user))

//     return user
//   } catch (error) {
//     return rejectWithValue(error.message || "Registration failed")
//   }
// })

// export const logout = createAsyncThunk("auth/logout", async () => {
//   localStorage.removeItem("user")
//   return null
// })

// export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async () => {
//   const user = localStorage.getItem("user")
//   return user ? JSON.parse(user) : null
// })

// // Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false
//         state.user = action.payload
//         state.isAuthenticated = true
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })

//       // Register
//       .addCase(register.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false
//         state.user = action.payload
//         state.isAuthenticated = true
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })

//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null
//         state.isAuthenticated = false
//       })

//       // Check Auth Status
//       .addCase(checkAuthStatus.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(checkAuthStatus.fulfilled, (state, action) => {
//         state.loading = false
//         state.user = action.payload
//         state.isAuthenticated = !!action.payload
//       })
//   },
// })

// export const { clearError } = authSlice.actions
// export default authSlice.reducer



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Use the environment variable for the API base URL
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// // Async thunks
// export const login = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       // Make API call to login using axios
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//         email,
//         password,
//       });

//       // Extract data from the response
//       const { accessToken, refreshToken, message } = response.data;

//       // Store tokens in localStorage
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       // Return the tokens and message to the reducer
//       return { accessToken, refreshToken, message };
//     } catch (error) {
//       // Handle error response
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// export const logout = createAsyncThunk("auth/logout", async () => {
//   // Clear tokens from localStorage
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("refreshToken");
//   return null;
// });

// export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async () => {
//   // Check if tokens exist in localStorage
//   const accessToken = localStorage.getItem("accessToken");
//   const refreshToken = localStorage.getItem("refreshToken");

//   if (accessToken && refreshToken) {
//     return { accessToken, refreshToken }; // Return tokens
//   }
//   return null; // No user logged in
// });

// // Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     accessToken: null,
//     refreshToken: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null,
//     message: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.message = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.isAuthenticated = true;
//         state.message = action.payload.message;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.accessToken = null;
//         state.refreshToken = null;
//         state.isAuthenticated = false;
//         state.message = null;
//       })

//       // Check Auth Status
//       .addCase(checkAuthStatus.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(checkAuthStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload?.accessToken || null;
//         state.refreshToken = action.payload?.refreshToken || null;
//         state.isAuthenticated = !!action.payload;
//       });
//   },
// });

// export const { clearError } = authSlice.actions;
// export default authSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";


// // Use the environment variable for the API base URL
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// // Async thunks
// export const login = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//         email,
//         password,
//       });

//       const { accessToken, refreshToken, message } = response.data;

//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       return { accessToken, refreshToken, message };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Login failed");
//     }
//   }
// );

// export const register = createAsyncThunk(
//   "auth/register",
//   async ({ username, email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
//         username,
//         email,
//         password,
//       });

//       const { accessToken, refreshToken, message } = response.data;

//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       return { message, accessToken, refreshToken };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Registration failed");
//     }
//   }
// );

// export const logout = createAsyncThunk("auth/logout", async () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("refreshToken");
//   return null;
// });

// export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async () => {
//   const accessToken = localStorage.getItem("token");
//   const refreshToken = localStorage.getItem("refreshToken");

//   if (accessToken && refreshToken) {
//     return { accessToken, refreshToken };
//   }
//   return null;
// });

// export const refreshToken = createAsyncThunk(
//   "auth/refreshToken",
//   async (_, { rejectWithValue }) => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");

//       if (!refreshToken) {
//         throw new Error("No refresh token found");
//       }

//       const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//         refreshToken,
//       });

//       const { accessToken, refreshToken: newRefreshToken } = response.data;

//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("refreshToken", newRefreshToken);

//       return { accessToken, refreshToken: newRefreshToken };
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Token refresh failed");
//     }
//   }
// );

// // Slice
// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     accessToken: null,
//     refreshToken: null,
//     isAuthenticated: false,
//     loading: false,
//     error: null,
//     message: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.message = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.isAuthenticated = true;
//         state.message = action.payload.message;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Register
//       .addCase(register.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.message = null;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.isAuthenticated = true;
//         state.message = action.payload.message;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.accessToken = null;
//         state.refreshToken = null;
//         state.isAuthenticated = false;
//         state.message = null;
//       })

//       // Check Auth Status
//       .addCase(checkAuthStatus.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(checkAuthStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload?.accessToken || null;
//         state.refreshToken = action.payload?.refreshToken || null;
//         state.isAuthenticated = !!action.payload;
//       })

//       // Refresh Token
//       .addCase(refreshToken.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(refreshToken.fulfilled, (state, action) => {
//         state.loading = false;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.isAuthenticated = true;
//       })
//       .addCase(refreshToken.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//         state.accessToken = null;
//         state.refreshToken = null;
//         state.isAuthenticated = false;
//       });
//   },
// });

// export const { clearError } = authSlice.actions;
// export default authSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api"; // Import the axiosInstance

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Use axiosInstance instead of axios
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken, message } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { accessToken, refreshToken, message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      // Use axiosInstance instead of axios
      const response = await axiosInstance.post("/auth/signup", {
        username,
        email,
        password,
      });

      const { accessToken, refreshToken, message } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      return { message, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// In authSlice.js
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      // Add your API call here
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        newPassword
      });

      return response.data;
    } catch (error) {
      // Handle different error responses
      if (error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || 'Password reset failed'
        });
      }
      if (error.request) {
        return rejectWithValue({
          status: 500,
          message: 'Network error - please check your connection'
        });
      }
      return rejectWithValue({
        status: 500,
        message: 'An unexpected error occurred'
      });
    }
  }
);


export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return null;
});

export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async () => {
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      // Use axiosInstance instead of axios
      const response = await axiosInstance.post("/auth/refresh", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Token refresh failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.message = null;
      })

      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload?.accessToken || null;
        state.refreshToken = action.payload?.refreshToken || null;
        state.isAuthenticated = !!action.payload;
      })

      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;