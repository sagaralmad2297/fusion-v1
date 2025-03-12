"use client"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa"
import { removeFromWishlist, clearWishlist } from "../../store/slices/wishlistSlice"
import { addToCart } from "../../store/slices/cartSlice"
import "./Wishlist.css"

const Wishlist = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.wishlist)

  const handleRemoveItem = (id) => {
    dispatch(removeFromWishlist(id))
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
    dispatch(removeFromWishlist(product.id))
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="page-title">My Wishlist</h1>

        {items.length > 0 ? (
          <>
            <div className="wishlist-header">
              <p>
                {items.length} {items.length === 1 ? "item" : "items"} in your wishlist
              </p>
              <button className="btn btn-danger clear-wishlist" onClick={() => dispatch(clearWishlist())}>
                Clear Wishlist
              </button>
            </div>

            <div className="wishlist-grid">
              {items.map((item) => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <Link to={`/product/${item.id}`}>
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    </Link>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                      <FaTrash />
                    </button>
                  </div>

                  <div className="wishlist-item-info">
                    <Link to={`/product/${item.id}`} className="item-name">
                      {item.name}
                    </Link>

                    <div className="item-price">
                      {item.discount > 0 ? (
                        <>
                          <span className="current-price">
                            ${(item.price - (item.price * item.discount) / 100).toFixed(2)}
                          </span>
                          <span className="original-price">${item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="current-price">${item.price.toFixed(2)}</span>
                      )}
                    </div>

                    <button className="btn btn-primary add-to-cart-btn" onClick={() => handleAddToCart(item)}>
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                  </div>
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
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist

