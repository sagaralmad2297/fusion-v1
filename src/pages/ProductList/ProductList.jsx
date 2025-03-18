"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductsByCategory } from "../../store/slices/productSlice"
import ProductCard from "../../components/ProductCard/ProductCard"
import { FaFilter, FaTimes } from "react-icons/fa"
import "./ProductList.css"

const ProductList = ({ category }) => {
  const dispatch = useDispatch()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const { products, loading } = useSelector((state) => state.products)

  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
    brands: [],
    sort: "newest",
  })

  const [showFilters, setShowFilters] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState([])

  const categoryParam = category || params.category
  const searchQuery = searchParams.get("q")

  useEffect(() => {
    if (categoryParam) {
      dispatch(fetchProductsByCategory(categoryParam))
    }
  }, [dispatch, categoryParam])

  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products]

      filtered = filtered.filter(
        (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      )

      if (filters.colors.length > 0) {
        filtered = filtered.filter((product) => filters.colors.some((color) => product.colors.includes(color)))
      }

      if (filters.sizes.length > 0) {
        filtered = filtered.filter((product) => filters.sizes.some((size) => product.sizes.includes(size)))
      }

      if (filters.brands.length > 0) {
        filtered = filtered.filter((product) => filters.brands.includes(product.brand))
      }

      switch (filters.sort) {
        case "price-low-high":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high-low":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case "popularity":
          filtered.sort((a, b) => b.popularity - a.popularity)
          break
        default:
          break
      }

      setFilteredProducts(filtered)
    }
  }, [products, filters])

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      switch (type) {
        case "priceRange":
          newFilters.priceRange = value
          break
        case "color":
          newFilters.colors = newFilters.colors.includes(value)
            ? newFilters.colors.filter((color) => color !== value)
            : [...newFilters.colors, value]
          break
        case "size":
          newFilters.sizes = newFilters.sizes.includes(value)
            ? newFilters.sizes.filter((size) => size !== value)
            : [...newFilters.sizes, value]
          break
        case "brand":
          newFilters.brands = newFilters.brands.includes(value)
            ? newFilters.brands.filter((brand) => brand !== value)
            : [...newFilters.brands, value]
          break
        case "sort":
          newFilters.sort = value
          break
        default:
          break
      }
      return newFilters
    })
  }

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      colors: [],
      sizes: [],
      brands: [],
      sort: "newest",
    })
  }

  const getCategoryTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`
    switch (categoryParam) {
      case "men": return "Men's Collection"
      case "women": return "Women's Collection"
      case "kids": return "Kids' Collection"
      default: return "All Products"
    }
  }

  return (
    <div className="product-list-page">
      <div className="full-width-container">
        <h1 className="page-title">{getCategoryTitle()}</h1>

        <div className="product-list-container">
          <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? "Close Filters" : "Show Filters"}
          </button>

          <div className={`filters-sidebar ${showFilters ? "show" : ""}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="reset-btn" onClick={resetFilters}>
                Reset All
              </button>
            </div>

            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-range">
                <span>${filters.priceRange[0]}</span>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [filters.priceRange[0], Number.parseInt(e.target.value)])
                  }
                  className="full-width-slider"
                />
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>

            <div className="filter-section">
              <h4>Colors</h4>
              <div className="filter-options grid-colors">
                {["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple"].map((color) => (
                  <label key={color} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color.toLowerCase())}
                      onChange={() => handleFilterChange("color", color.toLowerCase())}
                    />
                    <span className="color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                    {color}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Sizes</h4>
              <div className="filter-options grid-sizes">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <label key={size} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleFilterChange("size", size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Brands</h4>
              <div className="filter-options grid-brands">
                {["Nike", "Adidas", "Puma", "Reebok", "Under Armour", "New Balance"].map((brand) => (
                  <label key={brand} className="filter-option">
                    <input
                      type="checkbox"
                      checked={filters.brands.includes(brand)}
                      onChange={() => handleFilterChange("brand", brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="products-container">
            <div className="products-header">
              <p>{filteredProducts.length} products found</p>
              <div className="sort-dropdown">
                <label htmlFor="sort">Sort by:</label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="spinner"></div>
            ) : filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList