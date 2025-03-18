"use client"

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { forgotPassword } from "../../store/slices/authSlice";
import "./Auth.css";
import "react-toastify/dist/ReactToastify.css";

// Validation schema
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [error]);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("valuesss",values)
    toast.dismiss(); // Clear existing toasts
    
    dispatch(forgotPassword(values.email))
      .unwrap()
      .then(() => {
        toast.success("Password reset email sent! Please check your inbox.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitting(false);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to send reset email", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitting(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password</p>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="auth-form">
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

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Sending..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="auth-footer">
            Remember your password? <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="auth-image">
          {/* Optional image/illustration */}
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
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

export default ForgotPassword;