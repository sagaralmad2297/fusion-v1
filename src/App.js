"use client"

import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { useDispatch, useStore } from "react-redux"
import "./App.css"

// Components
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

// Pages
import Home from './pages/Home/Home'
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import ForgetPassword from './pages/Auth/ForgetPassword'
import ProductList from "./pages/ProductList/ProductList"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Checkout/Checkout"
import Wishlist from "./pages/Wishlist/Wishlist"
import Orders from "./pages/Orders/Orders"
import NotFound from "./pages/NotFound/NotFound"

// Auth
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import { checkAuthStatus } from "./store/slices/authSlice"
import ForgotPassword from "./pages/Auth/ForgetPassword"
import ResetPassword from "./pages/Auth/ResetPassword"

// Importing the function to set up Axios interceptors
import { setupInterceptors } from "./utils/api"

function App() {
  const dispatch = useDispatch()
  const store = useStore() // Get access to Redux store for interceptors

  // Setting up interceptors on component mount
  useEffect(() => {
    setupInterceptors(store)
    dispatch(checkAuthStatus())
  }, [dispatch, store])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/products/men" element={<ProductList category="men" />} />
          <Route path="/products/women" element={<ProductList category="women" />} />
          <Route path="/products/kids" element={<ProductList category="kids" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {/* Profile component */}
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
