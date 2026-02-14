import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, clearError } from "../../features/order/orderSlice";
import { Link } from "react-router-dom";
import { ClipboardList, Package, ChevronRight, AlertCircle, Calendar, DollarSign, User } from "lucide-react";
import Loader from "../../components/ui/Loader";
import BackButton from "../../components/ui/BackButton";

const MyOrders = () => {
  const dispatch = useDispatch();

  const { myOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "text-[var(--color-success-600)] bg-[var(--color-success-50)]";
      case "Shipped":
        return "text-[var(--color-primary-600)] bg-[var(--color-primary-100)]";
      case "Processing":
        return "text-[var(--color-accent-600)] bg-[var(--color-accent-100)]";
      case "Cancelled":
        return "text-[var(--color-error-600)] bg-[var(--color-error-50)]";
      default:
        return "text-[var(--color-accent-600)] bg-[var(--color-accent-100)]";
    }
  };

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Page Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
          <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-(--color-primary-600)" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">My Orders</h1>
      </div>

      {/* Loading */}
      {loading && <Loader text="Loading orders..." />}

      {/* Error */}
      {error && (
        <div className="card p-4 border-(--color-error-500) bg-(--color-error-50)">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-(--color-error-500)" />
            <p className="text-(--color-error-600) flex-1">{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-sm text-(--color-error-600) underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      {!loading && myOrders?.length > 0 ? (
        <div className="card overflow-hidden">
          {/* Orders Section Header */}
          <div className="p-4 sm:p-6 border-b border-theme-primary">
            <div className="flex items-center gap-2 group cursor-default">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
              <h2 className="text-base sm:text-lg font-semibold text-theme-primary">Order Items</h2>
              <span className="text-xs sm:text-sm text-theme-tertiary ml-1">({myOrders?.length})</span>
            </div>
          </div>

          {/* Orders */}
          <div className="divide-y divide-theme-primary">
            {myOrders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 hover:bg-theme-tertiary transition-all duration-200 group"
              >
                {/* Order Icon */}
                <div className="hidden sm:flex w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-theme-tertiary items-center justify-center shrink-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-theme-secondary" />
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                    <p className="font-semibold text-theme-primary text-sm sm:text-base">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-theme-tertiary">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      {order.user?.name || "Customer"}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-theme-primary">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                      ${order.totalPrice?.toFixed(2)}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      {order.orderItems?.length || 0} items
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-theme-muted group-hover:text-(--color-primary-600) transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        !loading && (
          <div className="card p-8 sm:p-12 text-center">
            <ClipboardList className="w-12 h-12 sm:w-16 sm:h-16 text-theme-muted mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-theme-primary mb-2">No orders yet</h2>
            <p className="text-theme-tertiary mb-6 text-sm sm:text-base">Start shopping to see your orders here.</p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Browse Products
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default MyOrders;
