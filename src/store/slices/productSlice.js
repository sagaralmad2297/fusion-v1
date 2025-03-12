// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// // Mock data
// const mockProducts = [
//   {
//     id: "1",
//     name: "Classic Denim Jacket",
//     price: 89.99,
//     discount: 10,
//     category: "men",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "A timeless denim jacket that never goes out of style. Perfect for layering in any season.",
//     shortDescription: "Classic denim jacket with button closure and multiple pockets.",
//     colors: ["blue", "black", "gray"],
//     sizes: ["S", "M", "L", "XL"],
//     brand: "Levi's",
//     rating: 4.5,
//     featured: true,
//     popularity: 95,
//     createdAt: "2023-01-15T00:00:00.000Z",
//     material: "Denim",
//     gender: "Men",
//     careInstructions: "Machine wash cold, tumble dry low",
//     countryOfOrigin: "USA",
//     reviews: [
//       {
//         id: "101",
//         userName: "John Doe",
//         userAvatar: "https://via.placeholder.com/40",
//         rating: 5,
//         date: "2023-03-10T00:00:00.000Z",
//         comment: "Great quality jacket, fits perfectly!",
//       },
//       {
//         id: "102",
//         userName: "Jane Smith",
//         userAvatar: "https://via.placeholder.com/40",
//         rating: 4,
//         date: "2023-02-22T00:00:00.000Z",
//         comment: "Nice jacket, but the color is slightly different from the picture.",
//       },
//     ],
//   },
//   {
//     id: "2",
//     name: "Floral Summer Dress",
//     price: 59.99,
//     discount: 15,
//     category: "women",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "A beautiful floral dress perfect for summer days and special occasions.",
//     shortDescription: "Lightweight floral dress with adjustable straps.",
//     colors: ["pink", "yellow", "white"],
//     sizes: ["XS", "S", "M", "L"],
//     brand: "Zara",
//     rating: 4.7,
//     featured: true,
//     popularity: 88,
//     createdAt: "2023-02-20T00:00:00.000Z",
//     material: "Cotton Blend",
//     gender: "Women",
//     careInstructions: "Hand wash cold, line dry",
//     countryOfOrigin: "Italy",
//     reviews: [
//       {
//         id: "201",
//         userName: "Emily Johnson",
//         userAvatar: "https://via.placeholder.com/40",
//         rating: 5,
//         date: "2023-04-05T00:00:00.000Z",
//         comment: "This dress is absolutely gorgeous! The fabric is high quality and the fit is perfect.",
//       },
//     ],
//   },
//   {
//     id: "3",
//     name: "Kids Dinosaur T-Shirt",
//     price: 24.99,
//     discount: 0,
//     category: "kids",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "A fun and colorful dinosaur t-shirt that kids will love to wear.",
//     shortDescription: "Soft cotton t-shirt with dinosaur print.",
//     colors: ["green", "blue", "red"],
//     sizes: ["3T", "4T", "5T", "6T"],
//     brand: "Carter's",
//     rating: 4.8,
//     featured: false,
//     popularity: 92,
//     createdAt: "2023-03-10T00:00:00.000Z",
//     material: "100% Cotton",
//     gender: "Kids",
//     careInstructions: "Machine wash cold, tumble dry low",
//     countryOfOrigin: "China",
//     reviews: [],
//   },
//   {
//     id: "4",
//     name: "Slim Fit Chino Pants",
//     price: 49.99,
//     discount: 0,
//     category: "men",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "Classic slim fit chino pants that are perfect for both casual and formal occasions.",
//     shortDescription: "Comfortable slim fit chinos with stretch fabric.",
//     colors: ["khaki", "navy", "olive"],
//     sizes: ["30", "32", "34", "36", "38"],
//     brand: "Gap",
//     rating: 4.3,
//     featured: false,
//     popularity: 85,
//     createdAt: "2023-01-25T00:00:00.000Z",
//     material: "Cotton Blend",
//     gender: "Men",
//     careInstructions: "Machine wash cold, tumble dry low",
//     countryOfOrigin: "Vietnam",
//     reviews: [],
//   },
//   {
//     id: "5",
//     name: "Women's Running Shoes",
//     price: 129.99,
//     discount: 20,
//     category: "women",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "High-performance running shoes designed for comfort and support during long runs.",
//     shortDescription: "Lightweight running shoes with cushioned soles.",
//     colors: ["black", "pink", "blue"],
//     sizes: ["6", "7", "8", "9", "10"],
//     brand: "Nike",
//     rating: 4.9,
//     featured: true,
//     popularity: 98,
//     createdAt: "2023-02-05T00:00:00.000Z",
//     material: "Synthetic",
//     gender: "Women",
//     careInstructions: "Spot clean only",
//     countryOfOrigin: "Vietnam",
//     reviews: [],
//   },
//   {
//     id: "6",
//     name: "Kids Winter Jacket",
//     price: 79.99,
//     discount: 0,
//     category: "kids",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "Warm and durable winter jacket to keep kids cozy during cold weather.",
//     shortDescription: "Insulated winter jacket with hood and multiple pockets.",
//     colors: ["red", "blue", "purple"],
//     sizes: ["4", "5", "6", "7", "8"],
//     brand: "The North Face",
//     rating: 4.7,
//     featured: true,
//     popularity: 90,
//     createdAt: "2023-03-15T00:00:00.000Z",
//     material: "Polyester",
//     gender: "Kids",
//     careInstructions: "Machine wash cold, tumble dry low",
//     countryOfOrigin: "China",
//     reviews: [],
//   },
//   {
//     id: "7",
//     name: "Men's Leather Wallet",
//     price: 39.99,
//     discount: 0,
//     category: "men",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "Genuine leather wallet with multiple card slots and a sleek design.",
//     shortDescription: "Classic bifold wallet made from genuine leather.",
//     colors: ["brown", "black"],
//     sizes: ["One Size"],
//     brand: "Fossil",
//     rating: 4.6,
//     featured: false,
//     popularity: 87,
//     createdAt: "2023-01-10T00:00:00.000Z",
//     material: "Genuine Leather",
//     gender: "Men",
//     careInstructions: "Wipe clean with damp cloth",
//     countryOfOrigin: "India",
//     reviews: [],
//   },
//   {
//     id: "8",
//     name: "Women's Cashmere Sweater",
//     price: 149.99,
//     discount: 10,
//     category: "women",
//     image: "https://via.placeholder.com/300",
//     images: ["https://via.placeholder.com/600", "https://via.placeholder.com/600"],
//     description: "Luxuriously soft cashmere sweater that provides warmth without bulk.",
//     shortDescription: "Soft cashmere sweater with ribbed cuffs and hem.",
//     colors: ["cream", "gray", "black", "burgundy"],
//     sizes: ["XS", "S", "M", "L", "XL"],
//     brand: "J.Crew",
//     rating: 4.8,
//     featured: true,
//     popularity: 93,
//     createdAt: "2023-02-15T00:00:00.000Z",
//     material: "100% Cashmere",
//     gender: "Women",
//     careInstructions: "Dry clean only",
//     countryOfOrigin: "Scotland",
//     reviews: [],
//   },
// ]

// // Async thunks
// export const fetchFeaturedProducts = createAsyncThunk("products/fetchFeatured", async () => {
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   return mockProducts.filter((product) => product.featured)
// })

// export const fetchNewArrivals = createAsyncThunk("products/fetchNewArrivals", async () => {
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   // Sort by date and get the newest products
//   return [...mockProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
// })

// export const fetchProductsByCategory = createAsyncThunk("products/fetchByCategory", async (category) => {
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   return mockProducts.filter((product) => product.category === category)
// })

// export const fetchProductById = createAsyncThunk("products/fetchById", async (id) => {
//   // Simulate API call
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   const product = mockProducts.find((product) => product.id === id)

//   if (!product) {
//     throw new Error("Product not found")
//   }

//   // Get related products (same category, different id)
//   const relatedProducts = mockProducts.filter((p) => p.category === product.category && p.id !== id).slice(0, 4)

//   return { product, relatedProducts }
// })

// // Slice
// const productSlice = createSlice({
//   name: "products",
//   initialState: {
//     products: [],
//     featuredProducts: [],
//     newArrivals: [],
//     product: null,
//     relatedProducts: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Featured Products
//       .addCase(fetchFeaturedProducts.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
//         state.loading = false
//         state.featuredProducts = action.payload
//       })
//       .addCase(fetchFeaturedProducts.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })

//       // Fetch New Arrivals
//       .addCase(fetchNewArrivals.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(fetchNewArrivals.fulfilled, (state, action) => {
//         state.loading = false
//         state.newArrivals = action.payload
//       })
//       .addCase(fetchNewArrivals.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })

//       // Fetch Products by Category
//       .addCase(fetchProductsByCategory.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
//         state.loading = false
//         state.products = action.payload
//       })
//       .addCase(fetchProductsByCategory.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })

//       // Fetch Product by ID
//       .addCase(fetchProductById.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(fetchProductById.fulfilled, (state, action) => {
//         state.loading = false
//         state.product = action.payload.product
//         state.relatedProducts = action.payload.relatedProducts
//       })
//       .addCase(fetchProductById.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.error.message
//       })
//   },
// })

// export default productSlice.reducer




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_BASE_URL; // Load from .env


export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    console.log("reeeeeeeeeeeeeeeeeeee",response)
    return response.data;
  } catch (error) {
    console.log("ererrrrr",error)
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
