"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { resetPassword } from "../../store/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Auth.css";

// Validation Schema
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = decodeURIComponent(searchParams.get("token") || "");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = (values, { setSubmitting }) => {
    if (!token) return;

    dispatch(resetPassword({ token, newPassword: values.password }))
      .unwrap()
      .then(() => {
        toast.success("Password reset successfully! Redirecting to login...", {
          autoClose: 3000,
          onClose: () => navigate("/login"),
        });
      })
      .catch((error) => {
        toast.error(error.message || "Failed to reset password");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>

          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="auth-form">
                <div className="form-group" style={{ position: "relative" }}>
                  <label>New Password</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`form-control ${
                        touched.password && errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter new password"
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
                  <ErrorMessage name="password" component="div" className="error" />
                </div>

                <div className="form-group" style={{ position: "relative" }}>
                  <label>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`form-control ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Confirm new password"
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting || !token}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
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
    </div>
  );
};

export default ResetPassword;
