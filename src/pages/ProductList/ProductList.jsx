"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { fetchFeaturedProducts } from "../../store/slices/productSlice";
import { FaFilter, FaTimes } from "react-icons/fa";
import "./ProductList.css";
import { useDispatch, useSelector } from "react-redux";

const ProductList = ({ category }) => {
  const dispatch = useDispatch();
  const { featuredProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const formattedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  const prevCategory = useRef(null);

  useEffect(() => {
    prevCategory.current = formattedCategory;
  }, [formattedCategory]);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    colors: [],
    sizes: [],
    brands: [],
    sort: "newest",
  });

  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    const payload = {
      category: formattedCategory,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      sizes: filters.sizes,
      brands: filters.brands,
      sort: filters.sort === "price-low-high" ? "price_asc" : "price_desc",
      search: searchQuery || undefined,
    };

    let timeoutId;
    if (prevCategory.current === formattedCategory) {
      timeoutId = setTimeout(() => {
        dispatch(fetchFeaturedProducts(payload));
      }, 300);
    } else {
      dispatch(fetchFeaturedProducts(payload));
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    dispatch,
    formattedCategory,
    filters.priceRange,
    filters.sizes,
    filters.brands,
    filters.sort,
    searchQuery,
  ]);

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      switch (type) {
        case "priceRange":
          newFilters.priceRange = value;
          break;
        case "size":
          newFilters.sizes = newFilters.sizes.includes(value)
            ? newFilters.sizes.filter((size) => size !== value)
            : [...newFilters.sizes, value];
          break;
        case "brand":
          newFilters.brands = newFilters.brands.includes(value)
            ? newFilters.brands.filter((brand) => brand !== value)
            : [...newFilters.brands, value];
          break;
        case "sort":
          newFilters.sort = value;
          break;
        default:
          break;
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      colors: [],
      sizes: [],
      brands: [],
      sort: "newest",
    });
  };

  const getCategoryTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    switch (category) {
      case "men":
        return "Men's Collection";
      case "women":
        return "Women's Collection";
      case "kids":
        return "Kids' Collection";
      default:
        return "All Products";
    }
  };

  const SkeletonProductCard = () => {
    return (
      <div
        style={{
          background: "#fff",
          padding: "15px",
          borderRadius: "8px",
          animation: "pulse 1.5s infinite",
        }}
      >
        <div
          style={{
            height: "200px",
            marginBottom: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
          }}
        ></div>
        <div>
          <div
            style={{
              height: "20px",
              width: "80%",
              marginBottom: "8px",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          ></div>
          <div
            style={{
              height: "18px",
              width: "60%",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="product-list-page">
      <div className="full-width-container">
        <h1 className="page-title">{getCategoryTitle()}</h1>

        <div className="product-list-container">
          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
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
                <span>₹{filters.priceRange[0]}</span>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      filters.priceRange[0],
                      Number.parseInt(e.target.value),
                    ])
                  }
                  className="full-width-slider"
                />
                <span>₹{filters.priceRange[1]}</span>
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
                {["kine", "Pdidas", "Yuma", "Geebok", "Over Arm", "Norvix"].map(
                  (brand) => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={() => handleFilterChange("brand", brand)}
                      />
                      {brand}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="products-container">
            <div className="products-header">
              {loading ? (
                <div
                  style={{
                    width: "150px",
                    height: "20px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                ></div>
              ) : (
                <p>{featuredProducts.length} products found</p>
              )}
              <div className="sort-dropdown">
                <label htmlFor="sort">Sort by:</label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                >
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="price-low-high">Price: Low to High</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonProductCard key={`skeleton-${index}`} />
                  ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <p>No products found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
