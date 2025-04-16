"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaArrowLeft, FaShoppingBag, FaTrashAlt } from "react-icons/fa"
import {
  updateCartItem,
  removeFromCart,
  clearCart,
  fetchCart,
  clearCartThunk,
} from "../../store/slices/cartSlice"
import "./Cart.css"

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, status, error } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [updatingItems, setUpdatingItems] = useState({})
  const [removingItems, setRemovingItems] = useState({})
  const [clearingCart, setClearingCart] = useState(false)
  const [cartTotal, setCartTotal] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch, isAuthenticated, navigate])

  useEffect(() => {
    // Safely calculate total even if items are being updated
    const total = items.reduce((sum, item) => {
      const price = item?.productId?.price || 0
      const quantity = item?.quantity || 0
      return sum + (price * quantity)
    }, 0)

    setCartTotal(total)
    setShippingCost(total > 50 ? 0 : 10)
  }, [items])

  const handleQuantityChange = async (productId, quantity, size) => {
    if (!productId || !size || quantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [`${productId}-${size}`]: true }));
    
    try {
      await dispatch(updateCartItem({ productId, quantity, size }));
    } finally {
      setUpdatingItems(prev => ({ ...prev, [`${productId}-${size}`]: false }));
      dispatch(fetchCart());
    }
  };
  
  const handleRemoveItem = async (id, size) => {
    setRemovingItems(prev => ({ ...prev, [`${id}-${size}`]: true }));
    
    try {
      await dispatch(removeFromCart({ itemId: id, size }));
    } finally {
      setRemovingItems(prev => ({ ...prev, [`${id}-${size}`]: false }));
      dispatch(fetchCart());
    }
  };
  
  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await dispatch(clearCartThunk());
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout")
  }

  // Format number to 2 decimal places safely
  const formatPrice = (num) => {
    if (isNaN(num)) return "0.00"
    return num.toFixed(2)
  }

  // Skeleton Loader Components
  const CartItemSkeleton = () => (
    <div className="cart-item skeleton">
      <div className="cart-item-product">
        <div className="cart-item-image skeleton-box"></div>
        <div className="cart-item-details">
          <h3 className="skeleton-line" style={{ width: '70%' }}></h3>
          <p className="skeleton-line" style={{ width: '50%' }}></p>
          <p className="skeleton-line" style={{ width: '40%' }}></p>
        </div>
      </div>
      <div className="cart-item-price skeleton-line" style={{ width: '60px' }}></div>
      <div className="cart-item-quantity">
        <div className="quantity-selector skeleton-box" style={{ width: '120px', height: '40px' }}></div>
      </div>
      <div className="cart-item-total skeleton-line" style={{ width: '60px' }}></div>
      <div className="cart-item-action skeleton-box" style={{ width: '40px', height: '40px' }}></div>
    </div>
  );

  const SummarySkeleton = () => (
    <div className="cart-summary skeleton">
      <h2 className="skeleton-line" style={{ width: '60%', height: '30px' }}></h2>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="summary-row">
          <span className="skeleton-line" style={{ width: '40%' }}></span>
          <span className="skeleton-line" style={{ width: '30%' }}></span>
        </div>
      ))}
      <div className="skeleton-box" style={{ width: '100%', height: '50px', marginTop: '20px' }}></div>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title skeleton-line" style={{ width: '250px', height: '40px' }}></h1>
          <div className="cart-container">
            <div className="cart-items">
              <div className="cart-header skeleton">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`cart-header-${['product', 'price', 'quantity', 'total', 'action'][i]} skeleton-line`}></div>
                ))}
              </div>
              {[...Array(3)].map((_, i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
            <SummarySkeleton />
          </div>
        </div>
      </div>
    );
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
                <div className="cart-header-action">delete</div>
              </div>

              {items.map((item) => {
                const itemPrice = item?.productId?.price || 0
                const itemQuantity = item?.quantity || 0
                const itemTotal = itemPrice * itemQuantity
                const itemKey = `${item._id}-${item.size}`
                const isUpdating = updatingItems[itemKey]
                const isRemoving = removingItems[itemKey]

                return (
                  <div key={item.id} className={`cart-item ${isUpdating || isRemoving ? 'updating' : ''}`}>
                    {isRemoving ? (
                      <div className="cart-item-removing">
                        <div className="removing-overlay"></div>
                        <span>Removing...</span>
                      </div>
                    ) : null}
                    
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
                      <span>${formatPrice(itemPrice)}</span>
                    </div>

                    <div className="cart-item-quantity">
                      {isUpdating ? (
                        <div className="quantity-loading">
                          <div className="loading-spinner"></div>
                        </div>
                      ) : (
                        <div className="quantity-selector">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item?.productId._id, itemQuantity - 1, item?.size)}
                            disabled={itemQuantity <= 1 || isUpdating}
                          >
                            -
                          </button>
                          <span className="quantity-value">{itemQuantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item?.productId._id, itemQuantity + 1, item?.size)}
                            disabled={isUpdating}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="cart-item-total">${formatPrice(itemTotal)}</div>

                    <div className="cart-item-action">
                      <button 
                        className="custom-button"
                        onClick={() => handleRemoveItem(item._id, item.size)}
                        disabled={isRemoving || isUpdating}
                      >
                        {isRemoving ? <div className="spinner"></div> : <FaTrashAlt />}
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
                <button
                  className="btn btn-danger clear-cart"
                  onClick={handleClearCart}
                  disabled={clearingCart}
                >
                  {clearingCart ? (
                    <>
                      <span className="spinner"></span> Clearing...
                    </>
                  ) : (
                    'Clear Cart'
                  )}
                </button>
              </div>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${formatPrice(cartTotal)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost > 0 ? `$${formatPrice(shippingCost)}` : "Free"}</span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <span>${formatPrice(cartTotal + shippingCost)}</span>
              </div>

              <button 
                className="btn btn-primary checkout-btn" 
                onClick={handleCheckout}
                disabled={clearingCart}
              >
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