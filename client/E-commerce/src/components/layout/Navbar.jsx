import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { Menu, X, ShoppingCart, User, LogOut, Home, Package, LayoutDashboard, Tag, ClipboardList, Users, Store } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cartItems.length;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${isActive(path)
      ? "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]"
      : "text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary"}`;

  const mobileLinkClasses = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
    ${isActive(path)
      ? "bg-[var(--color-primary-600)] text-white"
      : "text-theme-primary hover:bg-[var(--color-primary-600)] hover:text-white"}`;

  // Auth button classes with primary brand color for visibility
  const authButtonClasses = `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
    transition-all duration-200 
    text-[var(--color-primary-600)]
    hover:bg-[var(--color-primary-600)] hover:text-white hover:shadow-md`;

  return (
    <nav className="sticky top-0 z-50 bg-theme-navbar border-b border-theme-primary shadow-theme-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo - Larger with E-commerce Icon */}
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-bold text-(--color-primary-600) hover:text-(--color-primary-700) transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-primary-500) to-(--color-primary-700) flex items-center justify-center shadow-md">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span>E-Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated && (
              <>
                <Link to="/login" className={authButtonClasses}>Login</Link>
                <Link to="/register" className={authButtonClasses}>Register</Link>
              </>
            )}

            {isAuthenticated && user?.role !== "admin" && (
              <>
                <Link to="/" className={linkClasses("/")}>
                  <Home className="w-4 h-4" /> Home
                </Link>
                <Link to="/products" className={linkClasses("/products")}>
                  <Package className="w-4 h-4" /> Products
                </Link>
                <Link to="/cart" className={`${linkClasses("/cart")} relative`}>
                  <ShoppingCart className="w-4 h-4" /> Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-(--color-error-500) text-white text-xs font-bold leading-none">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className={linkClasses("/profile")}>
                  <User className="w-4 h-4" /> Profile
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link to="/admin/dashboard" className={linkClasses("/admin/dashboard")}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/admin/products" className={linkClasses("/admin/products")}>
                  <Package className="w-4 h-4" /> Products
                </Link>
                <Link to="/admin/categories" className={linkClasses("/admin/categories")}>
                  <Tag className="w-4 h-4" /> Categories
                </Link>
                <Link to="/admin/orders" className={linkClasses("/admin/orders")}>
                  <ClipboardList className="w-4 h-4" /> Orders
                </Link>
                <Link to="/admin/users" className={linkClasses("/admin/users")}>
                  <Users className="w-4 h-4" /> Users
                </Link>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={() => dispatch(logout())}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-(--color-error-600) hover:bg-(--color-error-50) transition-all duration-200"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}

            <div className="ml-2 pl-2 border-l border-theme-primary">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-theme-primary hover:bg-theme-tertiary transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-theme-navbar border-t border-theme-primary">
          <div className="px-4 py-3 space-y-1">
            {!isAuthenticated && (
              <>
                <Link to="/login" className={mobileLinkClasses("/login")} onClick={closeMenu}>Login</Link>
                <Link to="/register" className={mobileLinkClasses("/register")} onClick={closeMenu}>Register</Link>
              </>
            )}

            {isAuthenticated && user?.role !== "admin" && (
              <>
                <Link to="/" className={mobileLinkClasses("/")} onClick={closeMenu}>
                  <Home className="w-5 h-5" /> Home
                </Link>
                <Link to="/products" className={mobileLinkClasses("/products")} onClick={closeMenu}>
                  <Package className="w-5 h-5" /> Products
                </Link>
                <Link to="/cart" className={`${mobileLinkClasses("/cart")} relative`} onClick={closeMenu}>
                  <ShoppingCart className="w-5 h-5" /> Cart
                  {cartCount > 0 && (
                    <span className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-(--color-error-500) text-white text-xs font-bold leading-none">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className={mobileLinkClasses("/profile")} onClick={closeMenu}>
                  <User className="w-5 h-5" /> Profile
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
                <Link to="/admin/dashboard" className={mobileLinkClasses("/admin/dashboard")} onClick={closeMenu}>
                  <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Link to="/admin/products" className={mobileLinkClasses("/admin/products")} onClick={closeMenu}>
                  <Package className="w-5 h-5" /> Products
                </Link>
                <Link to="/admin/categories" className={mobileLinkClasses("/admin/categories")} onClick={closeMenu}>
                  <Tag className="w-5 h-5" /> Categories
                </Link>
                <Link to="/admin/orders" className={mobileLinkClasses("/admin/orders")} onClick={closeMenu}>
                  <ClipboardList className="w-5 h-5" /> Orders
                </Link>
                <Link to="/admin/users" className={mobileLinkClasses("/admin/users")} onClick={closeMenu}>
                  <Users className="w-5 h-5" /> Users
                </Link>
              </>
            )}

            {isAuthenticated && (
              <button
                onClick={() => { dispatch(logout()); closeMenu(); }}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-(--color-error-600) hover:bg-(--color-error-50) transition-all duration-200"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
