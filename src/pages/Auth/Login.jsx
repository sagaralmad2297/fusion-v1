// "use client"

// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useDispatch, useSelector } from "react-redux"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { login } from "../../store/slices/authSlice"
// import "./Auth.css"

// const loginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email address").required("Email is required"),
//   password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
// })

// const Login = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
//   const [loginError, setLoginError] = useState(null)

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/")
//     }
//   }, [isAuthenticated, navigate])

//   useEffect(() => {
//     if (error) {
//       setLoginError(error)
//     }
//   }, [error])

//   const handleSubmit = (values, { setSubmitting }) => {
//     setLoginError(null)
//     dispatch(login(values))
//       .unwrap()
//       .then(() => {
//         navigate("/")
//       })
//       .catch((err) => {
//         setLoginError(err.message || "Login failed. Please try again.")
//         setSubmitting(false)
//       })
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-form-container">
//           <h1>Login</h1>
//           <p>Welcome back! Please login to your account.</p>

//           {loginError && <div className="auth-error">{loginError}</div>}

//           <Formik initialValues={{ email: "", password: "" }} validationSchema={loginSchema} onSubmit={handleSubmit}>
//             {({ isSubmitting, touched, errors }) => (
//               <Form className="auth-form">
//                 <div className="form-group">
//                   <label htmlFor="email">Email</label>
//                   <Field
//                     type="email"
//                     name="email"
//                     id="email"
//                     className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
//                     placeholder="Enter your email"
//                   />
//                   <ErrorMessage name="email" component="div" className="error" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password">Password</label>
//                   <Field
//                     type="password"
//                     name="password"
//                     id="password"
//                     className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
//                     placeholder="Enter your password"
//                   />
//                   <ErrorMessage name="password" component="div" className="error" />
//                 </div>

//                 <div className="form-group remember-forgot">
                  
//                   <Link to="/forgot-password" className="forgot-password">
//                     Forgot password?
//                   </Link>
//                 </div>

//                 <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || loading}>
//                   {loading ? "Logging in..." : "Login"}
//                 </button>
//               </Form>
//             )}
//           </Formik>

//           <div className="auth-footer">
//             Don't have an account? <Link to="/register">Register</Link>
//           </div>
//         </div>

//         <div className="auth-image">
    
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login




"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../store/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";

// Yup validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: "", type: "" });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show snackbar
  const showSnackbar = (message, type = "error") => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar({ message: "", type: "" }), 3000);
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(login(values))
      .unwrap()
      .then(() => {
        showSnackbar("Login successful!", "success");
        setTimeout(() => navigate("/"), 1000);
      })
      .catch((err) => {
        const errMsg = err.message || "Login failed. Please try again.";
        showSnackbar(errMsg, "error");
        setSubmitting(false);
      });
  };

  const snackbarStyle = {
    position: "fixed",
    top: "30px",
    right: "30px",
    backgroundColor: snackbar.type === "success" ? "#4caf50" : "#f44336",
    color: "white",
    padding: "12px 24px",
    borderRadius: "4px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 9999,
    fontSize: "14px",
    minWidth: "250px",
    textAlign: "center",
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Login</h1>
          <p>Welcome back! Please login to your account.</p>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="auth-form">
                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Password Field */}
                <div className="form-group" style={{ position: "relative" }}>
                  <label htmlFor="password">Password</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className={`form-control ${
                        touched.password && errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Forgot password link */}
                <div className="form-group remember-forgot">
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>

        {/* Optional image section */}
        <div className="auth-image">{/* Add image if needed */}</div>
      </div>

      {/* Snackbar message */}
      {snackbar.message && <div style={snackbarStyle}>{snackbar.message}</div>}
    </div>
  );
};

export default Login;
