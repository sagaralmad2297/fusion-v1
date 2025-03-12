"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { login } from "../../store/slices/authSlice"
import "./Auth.css"

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
  const [loginError, setLoginError] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      setLoginError(error)
    }
  }, [error])

  const handleSubmit = (values, { setSubmitting }) => {
    setLoginError(null)
    dispatch(login(values))
      .unwrap()
      .then(() => {
        navigate("/")
      })
      .catch((err) => {
        setLoginError(err.message || "Login failed. Please try again.")
        setSubmitting(false)
      })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Login</h1>
          <p>Welcome back! Please login to your account.</p>

          {loginError && <div className="auth-error">{loginError}</div>}

          <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
            {({ isSubmitting, touched, errors }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>

                <div className="form-group remember-forgot">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button className="btn btn-google">
              <img src="https://via.placeholder.com/20" alt="Google" />
              Login with Google
            </button>
            <button className="btn btn-facebook">
              <img src="https://via.placeholder.com/20" alt="Facebook" />
              Login with Facebook
            </button>
          </div>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>

        <div className="auth-image">
          <img src="https://via.placeholder.com/600x800" alt="Login" />
        </div>
      </div>
    </div>
  )
}

export default Login

