"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
// import { fetchProductById } from "../../store/slices/productSlice"
import { addToCart } from "../../store/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice"
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaShieldAlt,
} from "react-icons/fa"
import ProductCard from "../../components/ProductCard/ProductCard"
import "./ProductDetail.css"

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, relatedProducts, loading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [activeTab, setActiveTab] = useState("description")

  const isInWishlist = wishlistItems.some((item) => item.id === product?.id)

  useEffect(() => {
    if (id) {
    //  dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0])
    }

    if (product && product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0])
    }
  }, [product])

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1)
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      return
    }

    dispatch(
      addToCart({
        ...product,
        quantity,
        selectedSize,
        selectedColor,
      }),
    )
  }

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      return
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist(product))
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon filled" />)
      } else {
        stars.push(<FaRegStar key={i} className="star-icon" />)
      }
    }

    return stars
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-container">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images ? product.images[selectedImage] : product.image} alt={product.name} />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image || "/placeholder.svg"} alt={`${product.name} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>

            <div className="product-meta">
              <div className="product-rating">
                {renderStars(product.rating || 4.5)}
                <span className="rating-count">({product.reviews?.length || 0} reviews)</span>
              </div>

              <div className="product-brand">
                Brand: <span>{product.brand}</span>
              </div>
            </div>

            <div className="product-price">
              {product.discount > 0 ? (
                <>
                  <span className="current-price">
                    ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                  </span>
                  <span className="original-price">${product.price.toFixed(2)}</span>
                  <span className="discount-badge">-{product.discount}%</span>
                </>
              ) : (
                <span className="current-price">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="product-description">
              <p>{product.shortDescription || "No description available."}</p>
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-colors">
                <h3>Color:</h3>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className={`color-option ${selectedColor === color ? "selected" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
                <span className="selected-color">{selectedColor}</span>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-sizes">
                <h3>Size:</h3>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <div
                      key={size}
                      className={`size-option ${selectedSize === size ? "selected" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="product-quantity">
              <h3>Quantity:</h3>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button className="quantity-btn" onClick={() => handleQuantityChange("increase")}>
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
              >
                <FaShoppingCart />
                Add to Cart
              </button>

              <button
                className={`btn ${isInWishlist ? "btn-wishlist-active" : "btn-wishlist"}`}
                onClick={handleToggleWishlist}
                disabled={!isAuthenticated}
              >
                {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                {isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Shipping & Returns */}
            <div className="product-features">
              <div className="feature">
                <FaTruck className="feature-icon" />
                <div className="feature-text">
                  <h4>Free Shipping</h4>
                  <p>On orders over $50</p>
                </div>
              </div>

              <div className="feature">
                <FaUndo className="feature-icon" />
                <div className="feature-text">
                  <h4>Easy Returns</h4>
                  <p>30 days return policy</p>
                </div>
              </div>

              <div className="feature">
                <FaShieldAlt className="feature-icon" />
                <div className="feature-text">
                  <h4>Secure Checkout</h4>
                  <p>100% Protected Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === "description" && (
              <div className="tab-pane">
                <p>{product.description || "No detailed description available."}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="tab-pane">
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td>Brand</td>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <td>Material</td>
                      <td>{product.material || "Not specified"}</td>
                    </tr>
                    <tr>
                      <td>Gender</td>
                      <td>{product.gender || "Unisex"}</td>
                    </tr>
                    <tr>
                      <td>Care Instructions</td>
                      <td>{product.careInstructions || "Not specified"}</td>
                    </tr>
                    <tr>
                      <td>Country of Origin</td>
                      <td>{product.countryOfOrigin || "Not specified"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-pane">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img
                              src={review.userAvatar || "https://via.placeholder.com/40"}
                              alt={review.userName}
                              className="reviewer-avatar"
                            />
                            <div>
                              <h4>{review.userName}</h4>
                              <div className="review-rating">{renderStars(review.rating)}</div>
                            </div>
                          </div>
                          <div className="review-date">{new Date(review.date).toLocaleDateString()}</div>
                        </div>
                        <div className="review-content">
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="products-grid">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail

