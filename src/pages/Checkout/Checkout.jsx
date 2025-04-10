"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

import { fetchCart } from "../../store/slices/cartSlice"

import "./Checkout.css"

const checkoutSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zipCode: Yup.string().required("ZIP code is required"),
  country: Yup.string().required("Country is required"),
})

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch, isAuthenticated, navigate])

  const subtotal = items.reduce((sum, item) => {
    return sum + item.productId.price * item.quantity
  }, 0)
  const shippingCost = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleSubmit = (values) => {
    console.log("Shipping form submitted with values:", values)
  }

  if (items.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-container">
          <Formik
            initialValues={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
              phone: user?.phone || "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
              country: "United States",
            }}
            validationSchema={checkoutSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className="checkout-form">
                <div className="checkout-sections">
                  <div className="checkout-section">
                    <h2 className="section-title">Shipping Information</h2>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <Field
                          type="text"
                          name="firstName"
                          id="firstName"
                          className={`form-control ${touched.firstName && errors.firstName ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="firstName" component="div" className="error" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <Field
                          type="text"
                          name="lastName"
                          id="lastName"
                          className={`form-control ${touched.lastName && errors.lastName ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="lastName" component="div" className="error" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="email" component="div" className="error" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className={`form-control ${touched.phone && errors.phone ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="phone" component="div" className="error" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <Field
                        type="text"
                        name="address"
                        id="address"
                        className={`form-control ${touched.address && errors.address ? "is-invalid" : ""}`}
                      />
                      <ErrorMessage name="address" component="div" className="error" />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <Field
                          type="text"
                          name="city"
                          id="city"
                          className={`form-control ${touched.city && errors.city ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="city" component="div" className="error" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <Field
                          type="text"
                          name="state"
                          id="state"
                          className={`form-control ${touched.state && errors.state ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="state" component="div" className="error" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP Code</label>
                        <Field
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          className={`form-control ${touched.zipCode && errors.zipCode ? "is-invalid" : ""}`}
                        />
                        <ErrorMessage name="zipCode" component="div" className="error" />
                      </div>

                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <Field
                          as="select"
                          name="country"
                          id="country"
                          className={`form-control ${touched.country && errors.country ? "is-invalid" : ""}`}
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                        </Field>
                        <ErrorMessage name="country" component="div" className="error" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="checkout-summary">
                  <h2 className="section-title">Order Summary</h2>

                  <div className="order-items">
                    {items.map((item) => {
                      const itemTotal = item.productId.price * item.quantity
                      return (
                        <div key={item.id} className="order-item">
                          <div style={{ position: "relative", width: "96px", height: "96px" }}>
                            <img
                              src={item.productId.images[0] || "/placeholder.svg"}
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <span
                              style={{
                                position: "absolute",
                                top: "4px",
                                right: "4px",
                                backgroundColor: "red",
                                color: "white",
                                padding: "2px 6px",
                                fontSize: "12px",
                                borderRadius: "999px",
                              }}
                            >
                              {item.quantity}
                            </span>
                          </div>

                          <div className="order-item-details">
                            <h3 className="item-name">{item.productId.name}</h3>
                            {item.selectedSize && <p className="item-size">Size: {item.selectedSize}</p>}
                            {item.selectedColor && <p className="item-color">Color: {item.selectedColor}</p>}
                          </div>
                          <div className="order-item-price">${itemTotal.toFixed(2)}</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping</span>
                      <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : "Free"}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="total-row grand-total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary place-order-btn"
                    disabled={isSubmitting}
                  >
                    place order
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Checkout
