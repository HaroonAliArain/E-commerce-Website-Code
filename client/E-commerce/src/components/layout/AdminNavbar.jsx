import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { Store, LogOut, Menu, X, LayoutDashboard, Package, Tag, ClipboardList, Users } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { toast } from "react-toastify";

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully!");
        closeMobileMenu();
        navigate("/");
    };

    // Menu items for mobile navigation
    const menuItems = [
        { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/products", icon: Package, label: "Products" },
        { path: "/admin/categories", icon: Tag, label: "Categories" },
        { path: "/admin/orders", icon: ClipboardList, label: "Orders" },
        { path: "/admin/users", icon: Users, label: "Users" },
    ];

    // Mobile link classes matching user navbar style
    const mobileLinkClasses = (path) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
        ${isActive(path)
            ? "bg-[var(--color-primary-600)] text-white"
            : "text-theme-primary hover:bg-[var(--color-primary-600)] hover:text-white"}`;

    return (
        <nav className="sticky top-0 w-full bg-theme-navbar border-b border-theme-primary shadow-theme-sm z-50">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Left: Logo */}
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 text-2xl font-bold text-(--color-primary-600) hover:text-(--color-primary-700) transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-primary-500) to-(--color-primary-700) flex items-center justify-center shadow-md">
                            <Store className="w-6 h-6 text-white" />
                        </div>
                        <span className="hidden sm:inline">E-Shop Admin</span>
                        <span className="sm:hidden">E-Shop</span>
                    </Link>

                    {/* Right: Desktop - Logout + Theme Toggle | Mobile - Theme Toggle + Hamburger */}
                    <div className="flex items-center gap-3">
                        {/* Logout Button - Desktop Only */}
                        <button
                            onClick={handleLogout}
                            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                                bg-(--color-primary-600) text-white
                                hover:bg-(--color-primary-700) 
                                transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>

                        {/* Theme Toggle - Desktop has separator */}
                        <div className="lg:pl-3 lg:border-l lg:border-theme-primary">
                            <ThemeToggle />
                        </div>

                        {/* Mobile Menu Button - Hamburger/Cross toggle (Right Side) */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 rounded-lg text-theme-primary hover:bg-theme-tertiary transition-all duration-200"
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Dropdown with sidebar links */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-theme-navbar border-t border-theme-primary">
                    <div className="px-4 py-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeMobileMenu}
                                className={mobileLinkClasses(item.path)}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        ))}

                        {/* Logout in mobile menu */}
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium 
                                text-(--color-error-600) hover:bg-(--color-error-50) transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;
