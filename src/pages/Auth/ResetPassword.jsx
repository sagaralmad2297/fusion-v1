"use client"
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { resetPassword } from '../../store/slices/authSlice';
import './Auth.css';

// Validation Schema
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth.resetPassword);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Password reset failed');
    }
  }, [error]);

  const handleSubmit = (values) => {
    dispatch(resetPassword({ token, newPassword: values.password }))
      .unwrap()
      .then(() => {
        toast.success('Password reset successfully! Redirecting to login...', {
          autoClose: 3000,
          onClose: () => navigate('/login')
        });
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>

          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="auth-form">
                <div className="form-group">
                  <label>New Password</label>
                  <Field
                    type="password"
                    name="password"
                    className={`form-control ${
                      touched.password && errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter new password"
                  />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>

                <div className="form-group">
                  <label>Confirm Password</label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${
                      touched.confirmPassword && errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm new password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error" />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={loading || isSubmitting}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
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