"use client"

import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, fetchNewArrivals } from "../../store/slices/productSlice"
import ProductCard from "../../components/ProductCard/ProductCard"
import "./Home.css"
import menImage from '../../asserts/images/men.jpg'
import womenImage from '../../asserts/images/women.jpg'
import kidsImage from '../../asserts/images/kids.jpg'

const Home = () => {
  const dispatch = useDispatch()
  const { featuredProducts, newArrivals, loading } = useSelector((state) => state.products)
  
  const { items: products, status } = useSelector((state) => state?.products);
  const data = products.data?.products;
  console.log("datataaa",data)
  useEffect(() => {
    dispatch(fetchProducts())
    //dispatch(fetchNewArrivals())
  }, [dispatch])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Elevate Your Style</h1>
            <p>Discover the latest trends in fashion for men, women, and kids.</p>
            <div className="hero-buttons">
              <Link to="/products/men" className="btn btn-primary">
                Shop Men
              </Link>
              <Link to="/products/women" className="btn btn-primary">
                Shop Women
              </Link>
              <Link to="/products/kids" className="btn btn-primary">
                Shop Kids
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products/men" className="category-card">
              <div className="category-image">
                <img src={menImage} alt="Men's Fashion" />
              </div>
              <h3>Men</h3>
            </Link>

            <Link to="/products/women" className="category-card">
              <div className="category-image">
                <img src={womenImage} alt="Women's Fashion" />
              </div>
              <h3>Women</h3>
            </Link>

            <Link to="/products/kids" className="category-card">
              <div className="category-image">
                <img src={kidsImage} alt="Kids' Fashion" />
              </div>
              <h3>Kids</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="products-grid">
              {data && data.map((product) => (
                <ProductCard product={product} />
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/products" className="btn btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals-section section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div className="products-grid">
              {data && data.map((product) => (
                <ProductCard product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="promotion-section">
        <div className="container">
          <div className="promotion-banner">
            <div className="promotion-content">
              <h2>Summer Sale</h2>
              <p>Up to 50% off on selected items</p>
              <Link to="/products/sale" className="btn btn-primary">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

