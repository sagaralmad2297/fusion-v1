"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import { useParams, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
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
import { fetchFeaturedProducts } from "../../store/slices/productSlice"

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { featuredProducts, loading, error } = useSelector((state) => state.products)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [activeTab, setActiveTab] = useState("description")
  const [isMobile, setIsMobile] = useState(false)
  
  // Zoom effect states and refs
  const [showZoom, setShowZoom] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef(null)
  const zoomRef = useRef(null)

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    const payload = { id: id }
    dispatch(fetchFeaturedProducts(payload))
  }, [dispatch, id])

  const product = featuredProducts?.[0]

  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0])
    }

    if (!product?.colors) {
      setSelectedColor("#2A3950")
    }
  }, [product])

  const isInWishlist = wishlistItems.some((item) => item.id === product?.id)

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1)
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  
    if (!selectedSize) return;
  
    dispatch(
      addToCart({
        productId: product._id,
        quantity,
      })
    );
  };
  
  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };
  

  // Zoom effect handlers
  const handleMouseMove = (e) => {
    if (!imageRef.current || isMobile) return
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    
    setZoomPosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (!isMobile) setShowZoom(true)
  }

  const handleMouseLeave = () => {
    setShowZoom(false)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating || 4)
    const hasHalfStar = (rating || 4) % 1 !== 0

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
    return <div className="container">Loading...</div>
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or failed to load.</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-container">
          {/* Product Images with Zoom Effect */}
          <div className="product-images">
            <div 
              className="main-image"
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src={product.images?.[selectedImage]} alt={product.name} />
              {!isMobile && showZoom && (
                <div 
                  className="zoom-lens"
                  style={{
                    left: `${zoomPosition.x}%`,
                    top: `${zoomPosition.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
            </div>

            {!isMobile && showZoom && (
              <div className="zoom-preview" ref={zoomRef}>
                <img 
                  src={product.images?.[selectedImage]} 
                  alt={`Zoomed ${product.name}`}
                  style={{
                    position: 'absolute',
                    left: `-${zoomPosition.x * 2}%`,
                    top: `-${zoomPosition.y * 2}%`,
                  }}
                />
              </div>
            )}

            {product.images?.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} - ${index + 1}`} />
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
                {renderStars(product.rating)}
                <span className="rating-count">(0 reviews)</span>
              </div>

              <div className="product-brand">
                Brand: <span>{product.brand}</span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">{product.formattedPrice || `₹${product.price}`}</span>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
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

            {/* Color Selection */}
          

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
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange("increase")}
                >
                  +
                </button>
              </div>
              <div
  style={{
    marginTop: '15px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
  }}
>
  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <button
      className="btn btn-primary add-to-cart-btn"
      onClick={handleAddToCart}
      style={{ width: '100%' }}
    >
      <FaShoppingCart />
      Add to Cart
    </button>
  </div>

  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
    <button
      className={`btn ${isInWishlist ? "btn-wishlist-active" : "btn-wishlist"}`}
      onClick={handleToggleWishlist}
      style={{ width: '100%' }}
    >
      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
      {isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
    </button>
  </div>
</div>


              
             
            </div>

            {/* Action Buttons */}
           
            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <FaTruck className="feature-icon" />
                <div className="feature-text">
                  <h4>Free Shipping</h4>
                  <p>On orders over ₹999</p>
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

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`tab-btn ${activeTab === "specifications" ? "active" : ""}`} onClick={() => setActiveTab("specifications")}>Specifications</button>
            <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews (0)</button>
          </div>

          <div className="tabs-content">
            {activeTab === "description" && (
              <div className="tab-pane">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="tab-pane">
                <table className="specs-table">
                  <tbody>
                    <tr><td>Brand</td><td>{product.brand}</td></tr>
                    <tr><td>Category</td><td>{product.category}</td></tr>
                    <tr><td>Stock</td><td>{product.stock}</td></tr>
                    <tr><td>Price</td><td>₹{product.price}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-pane">
                <div className="no-reviews">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail