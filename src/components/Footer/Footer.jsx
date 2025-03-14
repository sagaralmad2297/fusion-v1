import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa"
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FUSION</h3>
            <p>
              Your one-stop destination for all fashion needs. We provide high-quality clothing for men, women, and
              kids.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <FaPinterest />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li>
                <Link to="/products/men">Men's Clothing</Link>
              </li>
              <li>
                <Link to="/products/women">Women's Clothing</Link>
              </li>
              <li>
                <Link to="/products/kids">Kids' Clothing</Link>
              </li>
              <li>
                <Link to="/products/accessories">Accessories</Link>
              </li>
              <li>
                <Link to="/products/sale">Sale</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/size-guide">Size Guide</Link>
              </li>
              <li>
                <Link to="/track-order">Track Order</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Information</h4>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payment-methods">
            <img src="https://via.placeholder.com/40x25" alt="Visa" />
            <img src="https://via.placeholder.com/40x25" alt="Mastercard" />
            <img src="https://via.placeholder.com/40x25" alt="PayPal" />
            <img src="https://via.placeholder.com/40x25" alt="American Express" />
          </div>
          <p>&copy; {new Date().getFullYear()} FUSION. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

