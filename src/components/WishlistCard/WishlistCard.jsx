"use client"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { FaTrash, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useState } from "react"
import { removeFromWishlist } from "../../store/slices/wishlistSlice"
import { addToCart } from "../../store/slices/cartSlice"
import "./WishlistCard.css" // Reusing the same CSS

const WishlistCard = ({ product }) => {
  const dispatch = useDispatch()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Get all available images
  const images = Array.isArray(product?.images) ? product.images : 
                 product?.image ? [product.image] : 
                 ["/placeholder.svg"]

  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(removeFromWishlist(product.id))
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ 
      productId: product.id,
      quantity: 1,
      size: product.sizes?.[0] || 'M' // Default size if available
    }))
  }

  const handleNextImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const handlePrevImage = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
          />

          {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <div className="image-navigation">
              <button 
                className="nav-arrow left-arrow" 
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="nav-arrow right-arrow" 
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-description">
            {product.description}
          </p>

          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="current-price">
                  ₹{(product.price - (product.price * product.discount) / 100).toFixed(2)}
                </span>
                <span className="original-price">₹{product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">₹{product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist-specific actions */}
      <div className="wishlist-card-actions">
        <button 
          className="remove-btn"
          onClick={handleRemove}
          aria-label="Remove from wishlist"
        >
          <FaTrash /> Remove
        </button>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          aria-label="Add to cart"
        >
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  )
}

export default WishlistCard