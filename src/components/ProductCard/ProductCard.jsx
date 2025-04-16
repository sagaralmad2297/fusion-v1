"use client"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaHeart, FaRegHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { useState } from "react"
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const isInWishlist = wishlistItems.some((item) => item.id === product.id)
  
  // Get all available images
  const images = Array.isArray(product?.images) ? product.images : 
                 product?.image ? [product.image] : 
                 ["/placeholder.svg"]

  const handleToggleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      return
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id))
    } else {
      dispatch(addToWishlist(product))
    }
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

          {/* Navigation arrows - only show if there are multiple images */}
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

          <div className="product-actions">
            <button className="wishlist-btn" onClick={handleToggleWishlist} disabled={!isAuthenticated}>
              {isInWishlist ? <FaHeart className="wishlist-active" /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.85rem",
              color: "#555",
            }}
          >
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
    </div>
  )
}

export default ProductCard