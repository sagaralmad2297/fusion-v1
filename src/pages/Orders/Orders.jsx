"use client"

import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle, FaFileInvoice } from "react-icons/fa"
import { fetchUserOrders } from "../../store/slices/orderSlice"
import "./Orders.css"

const Orders = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { orders, loading } = useSelector((state) => state.orders)
  const { user } = useSelector((state) => state.auth)

  const orderSuccess = location.state?.orderSuccess

  useEffect(() => {
    dispatch(fetchUserOrders(user.id))
  }, [dispatch, user.id])

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaBox className="status-icon pending" />
      case "processing":
        return <FaTruck className="status-icon processing" />
      case "delivered":
        return <FaCheckCircle className="status-icon delivered" />
      case "cancelled":
        return <FaTimesCircle className="status-icon cancelled" />
      default:
        return <FaBox className="status-icon" />
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>

        {orderSuccess && (
          <div className="order-success">
            <FaCheckCircle className="success-icon" />
            <div className="success-message">
              <h2>Thank you for your order!</h2>
              <p>Your order has been placed successfully. You will receive a confirmation email shortly.</p>
            </div>
          </div>
        )}

        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span className={`status-text ${order.status}`}>{order.status}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        <img src={item.product.image || "/placeholder.svg"} alt={item.product.name} />
                      </div>
                      <div className="item-details">
                        <Link to={`/product/${item.product.id}`} className="item-name">
                          {item.product.name}
                        </Link>
                        <div className="item-meta">
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="order-actions">
                    <button className="btn btn-secondary">
                      <FaFileInvoice />
                      View Invoice
                    </button>
                    {order.status === "pending" && <button className="btn btn-danger">Cancel Order</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <div className="empty-orders-icon">
              <FaBox />
            </div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders yet. Start shopping to place your first order!</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders

