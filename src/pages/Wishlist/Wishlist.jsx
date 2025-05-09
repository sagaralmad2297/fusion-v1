"use client"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaShoppingCart, FaHeart, FaSpinner } from "react-icons/fa"
import { 
  fetchWishlist,
  removeFromWishlist, 
  clearWishlist
} from "../../store/slices/wishlistSlice"
import { addToCart } from "../../store/slices/cartSlice"
import ProductCard from "../../components/ProductCard/ProductCard"// Import your ProductCard component
import WishlistCard from "../../components/WishlistCard/WishlistCard"
import "./Wishlist.css"

const Wishlist = () => {
  const dispatch = useDispatch()
  const { 
    items, 
    loading, 
    error,
    totalItems 
  } = useSelector((state) => state.wishlist)

  // Fetch wishlist on component mount
  useEffect(() => {
    dispatch(fetchWishlist())
  }, [dispatch])

  const handleAddToCart = (product) => {
    dispatch(addToCart({ 
      productId: product._id, 
      quantity: 1,
      size: product.sizes?.[0] || 'M' // Default size if available
    }))
    dispatch(removeFromWishlist(product._id))
  }

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="error-message">
            <p>Error: {error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => dispatch(fetchWishlist())}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="page-title">My Wishlist</h1>

        {items.length > 0 ? (
          <>
            <div className="wishlist-header">
              <p>
                {totalItems} {totalItems === 1 ? "item" : "items"} in your wishlist
              </p>
              <button 
                className="btn btn-danger clear-wishlist" 
                onClick={() => dispatch(clearWishlist())}
                disabled={loading}
              >
                {loading ? 'Clearing...' : 'Clear Wishlist'}
              </button>
            </div>

            <div className="wishlist-grid">
              {items.map((item) => (
                <div key={item._id} className="wishlist-item-container">
                  {/* Reuse ProductCard component */}
                  <WishlistCard product={{
                    ...item,
                    id: item._id, // Map _id to id for ProductCard compatibility
                  }} />
                  
                  {/* Additional wishlist-specific actions */}
                 
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              <FaHeart />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
           
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist