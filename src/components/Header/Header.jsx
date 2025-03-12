"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { FaShoppingCart, FaHeart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa"
import { logout } from "../../store/slices/authSlice"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)
  const { items: wishlistItems } = useSelector((state) => state.wishlist)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
    setIsMenuOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/">FUSION</Link>
        </div>

        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
            <FaTimes />
          </button>

          <ul className="nav-links">
            <li>
              <Link to="/products/men" onClick={() => setIsMenuOpen(false)}>
                Men
              </Link>
            </li>
            <li>
              <Link to="/products/women" onClick={() => setIsMenuOpen(false)}>
                Women
              </Link>
            </li>
            <li>
              <Link to="/products/kids" onClick={() => setIsMenuOpen(false)}>
                Kids
              </Link>
            </li>
          </ul>

          <div className="nav-actions">
            <Link to="/cart" className="icon-btn" onClick={() => setIsMenuOpen(false)}>
              <FaShoppingCart />
              {items.length > 0 && <span className="badge">{items.length}</span>}
            </Link>

            <Link to="/wishlist" className="icon-btn" onClick={() => setIsMenuOpen(false)}>
              <FaHeart />
              {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
            </Link>

            {isAuthenticated ? (
              <div className="user-menu">
                <button className="user-btn">
                  <FaUser />
                  <span>{user?.name?.split(" ")[0]}</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                    Orders
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="login-btn" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </nav>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
          <FaBars />
        </button>
      </div>
    </header>
  )
}

export default Header

