"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { FaLock, FaCreditCard, FaPaypal } from "react-icons/fa"
import { clearCart } from "../../store/slices/cartSlice"
import { createOrder } from "../../store/slices/orderSlice"
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
  paymentMethod: Yup.string().required("Payment method is required"),
  cardName: Yup.string().when("paymentMethod", {
    is: "credit-card",
    then: Yup.string().required("Name on card is required"),
  }),
  cardNumber: Yup.string().when("paymentMethod", {
    is: "credit-card",
    then: Yup.string().required("Card number is required"),
  }),
  cardExpiry: Yup.string().when("paymentMethod", {
    is: "credit-card",
    then: Yup.string().required("Expiry date is required"),
  }),
  cardCvv: Yup.string().when("paymentMethod", {
    is: "credit-card",
    then: Yup.string().required("CVV is required"),
  }),
})

const Checkout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)

  const [orderProcessing, setOrderProcessing] = useState(false)

  // Calculate order summary
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price
    return sum + itemPrice * item.quantity
  }, 0)

  const shippingCost = subtotal > 50 ? 0 : 10
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shippingCost + tax

  const handleSubmit = (values, { setSubmitting }) => {
    setOrderProcessing(true)

    const orderData = {
      user: user.id,
      items: items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      })),
      shippingAddress: {
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
        phone: values.phone,
      },
      paymentMethod: values.paymentMethod,
      subtotal,
      shipping: shippingCost,
      tax,
      total,
      status: "pending",
    }

    // Simulate order processing
    setTimeout(() => {
      dispatch(createOrder(orderData))
        .unwrap()
        .then(() => {
          dispatch(clearCart())
          navigate("/orders", { state: { orderSuccess: true } })
        })
        .catch((error) => {
          console.error("Order failed:", error)
          setOrderProcessing(false)
          setSubmitting(false)
        })
    }, 2000)
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
              paymentMethod: "credit-card",
              cardName: "",
              cardNumber: "",
              cardExpiry: "",
              cardCvv: "",
            }}
            validationSchema={checkoutSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="checkout-form">
                <div className="checkout-sections">
                  {/* Shipping Information */}
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

                  {/* Payment Information */}
                  <div className="checkout-section">
                    <h2 className="section-title">Payment Information</h2>

                    <div className="payment-methods">
                      <div className="payment-method">
                        <label>
                          <Field
                            type="radio"
                            name="paymentMethod"
                            value="credit-card"
                            checked={values.paymentMethod === "credit-card"}
                            onChange={() => setFieldValue("paymentMethod", "credit-card")}
                          />
                          <FaCreditCard />
                          <span>Credit Card</span>
                        </label>
                      </div>

                      <div className="payment-method">
                        <label>
                          <Field
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={values.paymentMethod === "paypal"}
                            onChange={() => setFieldValue("paymentMethod", "paypal")}
                          />
                          <FaPaypal />
                          <span>PayPal</span>
                        </label>
                      </div>
                    </div>

                    {values.paymentMethod === "credit-card" && (
                      <div className="credit-card-form">
                        <div className="form-group">
                          <label htmlFor="cardName">Name on Card</label>
                          <Field
                            type="text"
                            name="cardName"
                            id="cardName"
                            className={`form-control ${touched.cardName && errors.cardName ? "is-invalid" : ""}`}
                          />
                          <ErrorMessage name="cardName" component="div" className="error" />
                        </div>

                        <div className="form-group">
                          <label htmlFor="cardNumber">Card Number</label>
                          <Field
                            type="text"
                            name="cardNumber"
                            id="cardNumber"
                            placeholder="XXXX XXXX XXXX XXXX"
                            className={`form-control ${touched.cardNumber && errors.cardNumber ? "is-invalid" : ""}`}
                          />
                          <ErrorMessage name="cardNumber" component="div" className="error" />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="cardExpiry">Expiry Date</label>
                            <Field
                              type="text"
                              name="cardExpiry"
                              id="cardExpiry"
                              placeholder="MM/YY"
                              className={`form-control ${touched.cardExpiry && errors.cardExpiry ? "is-invalid" : ""}`}
                            />
                            <ErrorMessage name="cardExpiry" component="div" className="error" />
                          </div>

                          <div className="form-group">
                            <label htmlFor="cardCvv">CVV</label>
                            <Field
                              type="text"
                              name="cardCvv"
                              id="cardCvv"
                              placeholder="XXX"
                              className={`form-control ${touched.cardCvv && errors.cardCvv ? "is-invalid" : ""}`}
                            />
                            <ErrorMessage name="cardCvv" component="div" className="error" />
                          </div>
                        </div>
                      </div>
                    )}

                    {values.paymentMethod === "paypal" && (
                      <div className="paypal-info">
                        <p>You will be redirected to PayPal to complete your payment.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="checkout-summary">
                  <h2 className="section-title">Order Summary</h2>

                  <div className="order-items">
                    {items.map((item) => {
                      const itemPrice = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price
                      const itemTotal = itemPrice * item.quantity

                      return (
                        <div key={item.id} className="order-item">
                          <div className="order-item-image">
                            <img src={item.image || "/placeholder.svg"} alt={item.name} />
                            <span className="item-quantity">{item.quantity}</span>
                          </div>
                          <div className="order-item-details">
                            <h3 className="item-name">{item.name}</h3>
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
                    disabled={isSubmitting || orderProcessing}
                  >
                    {orderProcessing ? (
                      <>Processing Order...</>
                    ) : (
                      <>
                        <FaLock />
                        Place Order
                      </>
                    )}
                  </button>

                  <div className="checkout-disclaimer">
                    <p>
                      By placing your order, you agree to our <a href="/terms">Terms of Service</a> and{" "}
                      <a href="/privacy-policy">Privacy Policy</a>.
                    </p>
                  </div>
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

