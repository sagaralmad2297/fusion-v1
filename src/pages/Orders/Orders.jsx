"use client"

import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {downloadInvoice, fetchAllOrders,fetchOrdersByUser} from "../../store/slices/orderSlice";
import { useDispatch, useSelector } from "react-redux"
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle, FaFileInvoice } from "react-icons/fa"
import "./Orders.css"

const Orders = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const orderSuccess = location.state?.orderSuccess

  const { orders, loading, error } = useSelector((state) => state.order || {});

  useEffect(()=>{
    dispatch(fetchOrdersByUser())
  },[dispatch])

  const handleDownloadInvoice = (orderId) => {
    dispatch(downloadInvoice(orderId));
  };

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

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : error ? (
          <div className="error">Error loading orders: {error}</div>
        ) : orders && orders.length > 0 ? (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="order-status">
                    {getStatusIcon(order.orderStatus.toLowerCase())}
                    <span className={`status-text ${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={`${item._id}-${index}`} className="order-item">
                      <div className="item-image">
                        <img src={item.images?.[0] || "/placeholder.svg"} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <Link to={`/product/${item.productId}`} className="item-name">
                          {item.name}
                        </Link>
                        <div className="item-meta" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
  {item.size && <span>Size: {item.size}</span>}
  <span>Qty: {item.quantity}</span>
  <span>Price: Rs.{item.price* item.quantity}</span>
</div>

                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="order-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleDownloadInvoice(order._id)}
                    >
                      <FaFileInvoice />
                      View Invoice
                    </button>
                    {order.orderStatus.toLowerCase() === "pending" && (
                      <button className="btn btn-danger">Cancel Order</button>
                    )}
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