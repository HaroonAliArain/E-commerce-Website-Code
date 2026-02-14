import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchOrderById,
  clearOrderDetails,
  clearError,
} from "../../features/order/orderSlice";
import { Package, Truck, CreditCard, MapPin, Calendar, CheckCircle, Clock, ClipboardList } from "lucide-react";
import Loader from "../../components/ui/Loader";
import BackButton from "../../components/ui/BackButton";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));

    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

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

  if (loading) return <Loader text="Loading order details..." />;

  if (error) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="card p-6 text-center">
          <p className="text-(--color-error-500)">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="card p-8 sm:p-12 text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-theme-muted mx-auto mb-4" />
          <p className="text-theme-tertiary text-base sm:text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  // Calculate prices from order items
  const itemsPrice = order.orderItems?.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return acc + price * quantity;
  }, 0) || 0;

  const shippingPrice = 10; // Fixed $10 shipping
  const taxPrice = Math.round(itemsPrice * 0.005); // 0.5% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-(--color-primary-600)" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">
            <span className="hidden sm:inline">Order </span>#{order._id?.slice(-8).toUpperCase()}
          </h1>
        </div>
        <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-md font-medium ${getStatusColor(order.orderStatus)}`}>
          {getStatusIcon(order.orderStatus)}
          {order.orderStatus || "Pending"}
        </span>
      </div>

      {/* Main Content Card */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">

          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 p-4 sm:p-6 pb-12 border-b lg:border-b-0 lg:border-r border-theme-primary">
            {/* Order Items Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 group cursor-default">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
              <h2 className="text-base sm:text-lg font-semibold text-theme-primary">Order Items</h2>
              <span className="text-xs sm:text-sm text-theme-tertiary">({order.orderItems?.length})</span>
            </div>

            {/* Order Items List */}
            <div className="space-y-3 sm:space-y-4">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-theme-tertiary">
                  {/* Product Image */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-theme-secondary flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 sm:w-8 sm:h-8 text-theme-muted" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-theme-primary text-sm sm:text-base line-clamp-2">{item.name}</p>
                    <p className="text-xs sm:text-sm text-theme-tertiary mt-1">
                      Qty: {item.quantity} × ${item.price?.toFixed(2)}
                    </p>
                    <p className="hidden sm:block text-xs text-theme-tertiary mt-1">
                      Subtotal: <span className="font-semibold text-theme-primary">${(item.quantity * item.price).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1 p-4 sm:p-6 pt-4 lg:pt-4 sm:pt-6 lg:mt-0 bg-theme-secondary border-t lg:border-t-0 border-theme-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none">

            {/* Shipping Address */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 group cursor-default">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h3 className="text-base sm:text-lg font-semibold text-theme-primary">Shipping Address</h3>
              </div>
              <div className="text-theme-secondary text-xs sm:text-sm space-y-1 bg-theme-card p-3 rounded-lg">
                <p className="flex items-center gap-1 text-theme-tertiary">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 group cursor-default">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h3 className="text-base sm:text-lg font-semibold text-theme-primary">Payment Method</h3>
              </div>
              <p className="text-theme-secondary text-xs sm:text-sm bg-theme-card p-3 rounded-lg">{order.paymentMethod}</p>
            </div>

            {/* Order Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3 group cursor-default">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h3 className="text-base sm:text-lg font-semibold text-theme-primary">Order Summary</h3>
              </div>
              <div className="space-y-2 text-xs sm:text-sm bg-theme-card p-3 rounded-lg">
                <div className="flex justify-between text-theme-secondary">
                  <span>Subtotal</span>
                  <span className="font-medium text-theme-primary">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-theme-secondary">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-theme-primary">${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-theme-secondary">
                  <span>Tax (0.5%)</span>
                  <span className="font-medium text-theme-primary">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base sm:text-lg text-theme-primary pt-2 border-t border-theme-primary">
                  <span>Total</span>
                  <span className="text-(--color-primary-600)">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
