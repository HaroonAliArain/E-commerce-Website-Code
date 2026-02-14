import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../features/admin/adminSlice";
import { Link } from "react-router-dom";
import { Users, ShoppingBag, Package, TrendingUp, ArrowRight, Calendar, DollarSign, LayoutDashboard } from "lucide-react";
import Loader from "../../components/ui/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading) return <Loader text="Loading dashboard..." />;

  if (error) {
    return (
      <div className="card p-6 text-center">
        <p className="text-(--color-error-500)">{error}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      color: "primary",
      link: "/admin/users",
      linkText: "View Users",
    },
    {
      title: "Total Orders",
      value: stats?.orders || 0,
      icon: ShoppingBag,
      color: "accent",
      link: "/admin/orders",
      linkText: "View Orders",
    },
    {
      title: "Total Products",
      value: stats?.products || 0,
      icon: Package,
      color: "success",
      link: "/admin/products",
      linkText: "View Products",
    },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case "primary":
        return {
          bg: "bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]",
          icon: "text-white",
          value: "text-[var(--color-primary-600)]",
        };
      case "accent":
        return {
          bg: "bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent-700)]",
          icon: "text-white",
          value: "text-[var(--color-accent-600)]",
        };
      case "success":
        return {
          bg: "bg-gradient-to-br from-[var(--color-success-500)] to-[var(--color-success-700)]",
          icon: "text-white",
          value: "text-[var(--color-success-600)]",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]",
          icon: "text-white",
          value: "text-[var(--color-primary-600)]",
        };
    }
  };

  // Get only first 4 recent orders
  const recentOrders = stats?.recentOrders?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-(--color-primary-600)" />
          </div>
          <h1 className="text-2xl font-bold text-theme-primary">Dashboard</h1>
        </div>

        {/* Date Button */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-theme-tertiary border border-theme-primary text-theme-secondary text-sm font-medium shadow-sm">
          <Calendar className="w-4 h-4 text-(--color-primary-600)" />
          <span className="hidden xs:inline">
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="xs:hidden">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={stat.title}
              className="card p-5 sm:p-6 hover:shadow-theme-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-theme-tertiary text-sm font-medium">{stat.title}</p>
                  <p className={`text-3xl sm:text-4xl font-bold mt-2 ${colors.value}`}>
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg`}>
                  <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} />
                </div>
              </div>

              {/* View All Button */}
              <Link
                to={stat.link}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                  bg-(--color-primary-600) text-white text-sm font-medium
                  hover:bg-(--color-primary-700) transition-all duration-200 
                  shadow-sm hover:shadow-md group-hover:shadow-lg"
              >
                {stat.linkText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-theme-primary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 group cursor-pointer">
            <TrendingUp className="w-6 h-6 text-(--color-primary-600) group-hover:text-(--color-accent-600) transition-colors duration-200" />
            <h2 className="font-semibold text-lg text-theme-primary group-hover:text-(--color-accent-600) transition-colors duration-200">New Orders</h2>
          </div>

          {/* View All Button - Date button style */}
          <Link
            to="/admin/orders"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl 
              bg-theme-tertiary border border-theme-primary text-theme-secondary text-sm font-medium
              hover:border-(--color-primary-500) hover:text-(--color-primary-600) 
              transition-all duration-200 shadow-sm"
          >
            View All Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-(--border-primary)">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="flex items-center justify-between p-4 sm:p-5 
                  hover:bg-theme-tertiary hover:shadow-inner
                  transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-theme-tertiary flex items-center justify-center group-hover:bg-(--color-accent-100) transition-all duration-200">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-theme-secondary group-hover:text-(--color-accent-600) transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-theme-primary group-hover:text-(--color-primary-600) transition-colors">
                      <span className="hidden sm:inline">Order #</span>
                      <span className="sm:hidden">#</span>
                      {order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs sm:text-sm text-theme-tertiary">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-theme-primary flex items-center gap-1">
                    <DollarSign className="w-4 h-4 hidden sm:inline" />
                    <span className="text-sm sm:text-base">${order.totalPrice?.toLocaleString()}</span>
                  </p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${order.orderStatus === "Delivered"
                    ? "bg-(--color-success-50) text-(--color-success-600)"
                    : order.orderStatus === "Shipped"
                      ? "bg-(--color-primary-100) text-(--color-primary-600)"
                      : "bg-(--color-accent-100) text-(--color-accent-600)"
                    }`}>
                    {order.orderStatus || "Pending"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-theme-tertiary flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-theme-muted" />
            </div>
            <p className="text-theme-tertiary font-medium">No recent orders</p>
            <p className="text-theme-muted text-sm mt-1">Orders will appear here once customers start purchasing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
