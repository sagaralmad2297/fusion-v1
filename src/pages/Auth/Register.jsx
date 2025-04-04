// "use client"

// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useDispatch, useSelector } from "react-redux"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { register } from "../../store/slices/authSlice"
// import "./Auth.css"

// const registerSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
//   email: Yup.string().email("Invalid email address").required("Email is required"),
//   password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm password is required"),
// })

// const Register = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const { isAuthenticated, loading, error } = useSelector((state) => state.auth)
//   const [registerError, setRegisterError] = useState(null)

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/")
//     }
//   }, [isAuthenticated, navigate])

//   useEffect(() => {
//     if (error) {
//       setRegisterError(error)
//     }
//   }, [error])

//   const handleSubmit = (values, { setSubmitting }) => {
//     setRegisterError(null)
//     const { name, email, password } = values

//     dispatch(register({ name, email, password }))
//       .unwrap()
//       .then(() => {
//         navigate("/")
//       })
//       .catch((err) => {
//         setRegisterError(err.message || "Registration failed. Please try again.")
//         setSubmitting(false)
//       })
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-form-container">
//           <h1>Create Account</h1>
//           <p>Join us today! Create your account to start shopping.</p>

//           {registerError && <div className="auth-error">{registerError}</div>}

//           <Formik
//             initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
//             validationSchema={registerSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting, touched, errors }) => (
//               <Form className="auth-form">
//                 <div className="form-group">
//                   <label htmlFor="name">Full Name</label>
//                   <Field
//                     type="text"
//                     name="name"
//                     id="name"
//                     className={`form-control ${touched.name && errors.name ? "is-invalid" : ""}`}
//                     placeholder="Enter your full name"
//                   />
//                   <ErrorMessage name="name" component="div" className="error" />
//                 </div>

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
//                     placeholder="Create a password"
//                   />
//                   <ErrorMessage name="password" component="div" className="error" />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="confirmPassword">Confirm Password</label>
//                   <Field
//                     type="password"
//                     name="confirmPassword"
//                     id="confirmPassword"
//                     className={`form-control ${touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""}`}
//                     placeholder="Confirm your password"
//                   />
//                   <ErrorMessage name="confirmPassword" component="div" className="error" />
//                 </div>

//                 <div className="form-group terms">
//                   <input type="checkbox" id="terms" required />
//                   <label htmlFor="terms">
//                     I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
//                     <Link to="/privacy-policy">Privacy Policy</Link>
//                   </label>
//                 </div>

//                 <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || loading}>
//                   {loading ? "Creating Account..." : "Create Account"}
//                 </button>
//               </Form>
//             )}
//           </Formik>

//           <div className="auth-divider">
//             <span>OR</span>
//           </div>

//           <div className="social-login">
//             <button className="btn btn-google">
//               <img src="https://via.placeholder.com/20" alt="Google" />
//               Sign up with Google
//             </button>
//             <button className="btn btn-facebook">
//               <img src="https://via.placeholder.com/20" alt="Facebook" />
//               Sign up with Facebook
//             </button>
//           </div>

//           <div className="auth-footer">
//             Already have an account? <Link to="/login">Login</Link>
//           </div>
//         </div>

//         <div className="auth-image">
//           <img src="https://via.placeholder.com/600x800" alt="Register" />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Register



"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../../store/slices/authSlice";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

// Yup validation schema
const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(2, "Username must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [registerError, setRegisterError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to home page if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Update register error if there's an error from the authSlice
  useEffect(() => {
    if (error) {
      setRegisterError(error);
      toast.error(error); // Display error toast
    }
  }, [error]);

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    setRegisterError(null); // Clear previous errors

    dispatch(register(values))
      .unwrap()
      .then(() => {
        toast.success("Registration successful!");

        // Redirect after success
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        setRegisterError(err.message);
        toast.error(err.message); // Display error toast
        setSubmitting(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Create Account</h1>
          <p>Join us today! Create your account to start shopping.</p>

          {/* Formik form */}
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="auth-form">
                {/* Username field */}
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    className={`form-control ${
                      touched.username && errors.username ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Email field */}
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

                {/* Password field with visibility toggle */}
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
                      placeholder="Create a password"
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

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Auth footer */}
          <div className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>

        {/* Auth image (optional) */}
        <div className="auth-image">
          <img src="https://via.placeholder.com/600x800" alt="Register" />
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Register;
