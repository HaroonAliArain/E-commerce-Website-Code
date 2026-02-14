import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ClipboardList, Users } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const menuItems = [
    { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/categories", icon: Tag, label: "Categories" },
    { path: "/admin/orders", icon: ClipboardList, label: "Orders" },
    { path: "/admin/users", icon: Users, label: "Users" },
  ];

  return (
    // Sidebar - Only visible on large screens (mobile uses navbar hamburger menu)
    <aside className="hidden lg:flex lg:w-[15%] lg:min-w-50 lg:max-w-60 bg-theme-sidebar border-r border-theme-primary flex-col">
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              relative flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium 
              transition-all duration-200 group
              ${isActive(item.path)
                ? "bg-(--color-primary-600) text-white shadow-md"
                : "text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary"
              }
            `}
          >
            {/* Active Indicator */}
            {isActive(item.path) && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
            )}

            <item.icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
