"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaArrowLeft, FaShoppingBag } from "react-icons/fa"
import { updateCartItem, removeFromCart, clearCart } from "../../store/slices/cartSlice"
import "./Cart.css"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const [cartTotal, setCartTotal] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")

  useEffect(() => {
    // Calculate cart total
    const total = items.reduce((sum, item) => {
      const itemPrice = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price
      return sum + itemPrice * item.quantity
    }, 0)

    setCartTotal(total)

    // Calculate shipping cost (free shipping over $50)
    setShippingCost(total > 50 ? 0 : 10)
  }, [items])

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return

    dispatch(updateCartItem({ id, quantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
  }

  const handleApplyPromo = () => {
    setPromoError("")

    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    // Example promo codes
    if (promoCode.toUpperCase() === "SAVE10") {
      setDiscount(cartTotal * 0.1)
    } else if (promoCode.toUpperCase() === "SAVE20") {
      setDiscount(cartTotal * 0.2)
    } else {
      setPromoError("Invalid promo code")
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login")
    } else {
      navigate("/checkout")
    }
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
                const itemPrice = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price
                const itemTotal = itemPrice * item.quantity

                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-product">
                      <div className="cart-item-image">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        {item.selectedColor && (
                          <p className="cart-item-color">
                            Color: <span style={{ color: item.selectedColor }}>{item.selectedColor}</span>
                          </p>
                        )}
                        {item.selectedSize && <p className="cart-item-size">Size: {item.selectedSize}</p>}
                      </div>
                    </div>

                    <div className="cart-item-price">
                      {item.discount > 0 ? (
                        <>
                          <span className="current-price">${itemPrice.toFixed(2)}</span>
                          <span className="original-price">${item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span>${item.price.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="cart-item-quantity">
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-total">${itemTotal.toFixed(2)}</div>

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
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : "Free"}</span>
              </div>

              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-total">
                <span>Total</span>
                <span>${(cartTotal + shippingCost - discount).toFixed(2)}</span>
              </div>

              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleApplyPromo}>
                  Apply
                </button>
              </div>

              {promoError && <div className="promo-error">{promoError}</div>}

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

