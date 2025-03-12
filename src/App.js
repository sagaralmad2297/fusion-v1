"use client"

import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"

// Components
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

// Pages
import Home from './pages/Home/Home'
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import ProductList from "./pages/ProductList/ProductList"
import ProductDetail from "./pages/ProductDetail/ProductDetail"
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Checkout/Checkout"
import Wishlist from "./pages/Wishlist/Wishlist"
import Orders from "./pages/Orders/Orders"
import NotFound from "./pages/NotFound/NotFound"

// Auth
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import { useDispatch } from "react-redux"
import { checkAuthStatus } from "./store/slices/authSlice"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/men" element={<ProductList category="men" />} />
          <Route path="/products/women" element={<ProductList category="women" />} />
          <Route path="/products/kids" element={<ProductList category="kids" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

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

