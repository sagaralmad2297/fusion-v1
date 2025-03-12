"use client"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa"
import { addToCart } from "../../store/slices/cartSlice"
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice"
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ ...product, quantity: 1 }))
  }

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

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} />

          {product.discount > 0 && <span className="discount-badge">-{product.discount}%</span>}

          <div className="product-actions">
            <button className="wishlist-btn" onClick={handleToggleWishlist} disabled={!isAuthenticated}>
              {isInWishlist ? <FaHeart className="wishlist-active" /> : <FaRegHeart />}
            </button>

            <button className="cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart />
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>

          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="current-price">
                  ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                </span>
                <span className="original-price">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="current-price">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard

