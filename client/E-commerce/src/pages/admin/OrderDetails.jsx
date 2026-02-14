import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Package, User, MapPin, CreditCard, Truck, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Loader from "../../components/ui/Loader";
import BackButton from "../../components/ui/BackButton";
import api from "../../services/api";
import { toast } from "react-toastify";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/api/orders/${id}`);
      setOrder({
        ...data.order,
        orderStatus: data.order.orderStatus || "Pending",
      });
      setStatus(data.order.orderStatus || "Pending");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const { data } = await api.put(`/api/orders/${id}/status`, {
        orderStatus: status,
      });
      setOrder({
        ...data.order,
        orderStatus: data.order.orderStatus || "Pending",
      });
      toast.success(`Order status updated to ${data.order.orderStatus}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (orderStatus) => {
    switch (orderStatus) {
      case "Delivered":
        return "bg-[var(--color-success-50)] text-[var(--color-success-600)]";
      case "Shipped":
        return "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]";
      case "Processing":
        return "bg-[var(--color-accent-100)] text-[var(--color-accent-600)]";
      case "Cancelled":
        return "bg-[var(--color-error-50)] text-[var(--color-error-600)]";
      default:
        return "bg-[var(--color-accent-100)] text-[var(--color-accent-600)]";
    }
  };

  const getStatusIcon = (orderStatus) => {
    switch (orderStatus) {
      case "Delivered":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) return <Loader text="Loading order details..." />;

  if (error) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="card p-6 text-center">
          <AlertCircle className="w-12 h-12 text-(--color-error-500) mx-auto mb-3" />
          <p className="text-(--color-error-500)">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-theme-muted mx-auto mb-4" />
          <p className="text-theme-tertiary text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Order Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
                <Package className="w-5 h-5 text-(--color-primary-600)" />
              </div>
              <h1 className="text-2xl font-bold text-theme-primary">
                <span className="sm:hidden">Order</span>
                <span className="hidden sm:inline">Order #{order._id?.slice(-8).toUpperCase()}</span>
              </h1>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
            {getStatusIcon(order.orderStatus)}
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="card p-4 hover:shadow-theme-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4 group cursor-pointer">
              <User className="w-5 h-5 text-(--color-primary-600) group-hover:text-(--color-accent-600) transition-colors duration-200" />
              <h3 className="font-semibold text-theme-primary group-hover:text-(--color-accent-600) transition-colors duration-200">Customer</h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--color-primary-400) to-(--color-primary-600) flex items-center justify-center text-white font-medium">
                {order.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-theme-primary">{order.user?.name}</p>
                <p className="text-sm text-theme-tertiary">{order.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card overflow-hidden hover:shadow-theme-md transition-all duration-200">
            <div className="p-4 border-b border-theme-primary flex items-center gap-3 group cursor-pointer">
              <Package className="w-5 h-5 text-(--color-primary-600) group-hover:text-(--color-accent-600) transition-colors duration-200" />
              <h3 className="font-semibold text-theme-primary group-hover:text-(--color-accent-600) transition-colors duration-200">Items</h3>
              <span className="text-theme-tertiary text-sm">({order.orderItems?.length})</span>
            </div>

            <div className="divide-y divide-(--border-primary)">
              {order.orderItems?.length > 0 ? (
                order.orderItems.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-theme-tertiary flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-theme-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-theme-primary truncate">{item.name}</p>
                      <p className="text-sm text-theme-tertiary">
                        {item.quantity} × ${item.price?.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold text-theme-primary">
                      ${(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-theme-tertiary">No items in this order</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="card p-4 hover:shadow-theme-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4 group cursor-pointer">
              <Truck className="w-5 h-5 text-(--color-primary-600) group-hover:text-(--color-accent-600) transition-colors duration-200" />
              <h3 className="font-semibold text-theme-primary group-hover:text-(--color-accent-600) transition-colors duration-200">Status</h3>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                text-theme-primary mb-3
                focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                transition-all duration-200"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || status === order.orderStatus}
              className="w-full py-2.5 rounded-lg font-medium transition-all duration-200
                bg-(--color-primary-600) text-white
                hover:bg-(--color-primary-700) disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>

          {/* Shipping Address */}
          <div className="card p-4 hover:shadow-theme-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4 group cursor-pointer">
              <MapPin className="w-5 h-5 text-(--color-primary-600) group-hover:text-(--color-accent-600) transition-colors duration-200" />
              <h3 className="font-semibold text-theme-primary group-hover:text-(--color-accent-600) transition-colors duration-200">Address</h3>
            </div>
            <div className="text-theme-secondary text-sm space-y-1">
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
            <p className="text-xs text-theme-tertiary mt-3 pt-3 border-t border-theme-primary">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Payment & Summary */}
          <div className="card p-4 hover:shadow-theme-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4 group cursor-pointer">
              <CreditCard className="w-5 h-5 text-(--color-primary-600) group-hover:text-(--color-accent-600) transition-colors duration-200" />
              <h3 className="font-semibold text-theme-primary group-hover:text-(--color-accent-600) transition-colors duration-200">Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-theme-secondary">
                <span>Payment Method</span>
                <span className="font-medium text-theme-primary">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Subtotal ({order.orderItems?.length} items)</span>
                <span className="font-medium text-theme-primary">
                  ${order.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Shipping</span>
                <span className="font-medium text-theme-primary">$10.00</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Tax (0.5%)</span>
                <span className="font-medium text-theme-primary">
                  ${(order.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 0.005).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg text-theme-primary pt-2 border-t border-theme-primary">
                <span>Total</span>
                <span className="text-(--color-primary-600)">
                  ${(() => {
                    const subtotal = order.orderItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
                    const shipping = 10;
                    const tax = Math.round(subtotal * 0.005);
                    return (subtotal + shipping + tax).toLocaleString();
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
