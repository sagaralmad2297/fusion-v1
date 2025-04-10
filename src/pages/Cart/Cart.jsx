"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaArrowLeft, FaShoppingBag } from "react-icons/fa"
import {
  updateCartItem,
  removeFromCart,
  clearCart,
  fetchCart,
} from "../../store/slices/cartSlice"
import "./Cart.css"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, status, error } = useSelector((state) => state.cart)
  console.log("iiiiiiiiiiiii00",items)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [cartTotal, setCartTotal] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch, isAuthenticated, navigate])

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity
    }, 0)

    setCartTotal(total)
    setShippingCost(total > 50 ? 0 : 10)
  }, [items])

  const handleQuantityChange = (productId, quantity) => {
    console.log("iddddddddddddddd",productId)
    if (quantity < 1) return
    dispatch(updateCartItem({ productId, quantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  if (status === "loading") {
    return <div className="cart-loading">Loading your cart...</div>
  }

  if (status === "failed") {
    return <div className="cart-error">Failed to load cart: {error}</div>
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="cart-container">
            <div className="cart-items">
              <div className="cart-header">
                <div className="cart-header-product">Product</div>
                <div className="cart-header-price">Price</div>
                <div className="cart-header-quantity">Quantity</div>
                <div className="cart-header-total">Total</div>
                <div className="cart-header-action"></div>
              </div>

              {items.map((item) => {
                const itemPrice = item.productId.price
                const itemTotal = itemPrice * item.quantity

                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-product">
                      <div className="cart-item-image">
                        <img
                          src={item.productId.images?.[0] || "/placeholder.svg"}
                          alt={item.productId.name}
                        />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.productId.name}</h3>
                        {item.selectedColor && (
                          <p className="cart-item-color">
                            Color:{" "}
                            <span style={{ color: item.selectedColor }}>
                              {item.selectedColor}
                            </span>
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="cart-item-size">Size: {item.selectedSize}</p>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-price">
                      <span>${itemPrice?.toFixed(2)}</span>
                    </div>

                    <div className="cart-item-quantity">
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item?.productId._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item?.productId._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">${itemTotal?.toFixed(2)}</div>

                    <div className="cart-item-action">
                      <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )
              })}

              <div className="cart-actions">
                <Link to="/products" className="btn btn-secondary continue-shopping">
                  <FaArrowLeft />
                  Continue Shopping
                </Link>
                <button className="btn btn-danger clear-cart" onClick={() => dispatch(clearCart())}>
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal?.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost > 0 ? `$${shippingCost?.toFixed(2)}` : "Free"}</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>${(cartTotal + shippingCost)?.toFixed(2)}</span>
              </div>

              <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <div className="secure-checkout">
                <p>Secure Checkout</p>
                <div className="payment-methods">
                  <img src="https://via.placeholder.com/40x25" alt="Visa" />
                  <img src="https://via.placeholder.com/40x25" alt="Mastercard" />
                  <img src="https://via.placeholder.com/40x25" alt="PayPal" />
                  <img src="https://via.placeholder.com/40x25" alt="American Express" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <FaShoppingBag />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
