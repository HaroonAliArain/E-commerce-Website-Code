import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShoppingBag, Eye, AlertCircle, Calendar, DollarSign, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { deleteOrder } from "../../features/order/orderSlice";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/orders/allorders");
      const formattedOrders = data.allOrders.map((order) => ({
        ...order,
        orderStatus: order.orderStatus || "Pending",
      }));
      setOrders(formattedOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async () => {
    if (!deleteConfirm) return;

    try {
      await dispatch(deleteOrder(deleteConfirm._id)).unwrap();
      // Remove from local state
      setOrders(orders.filter((order) => order._id !== deleteConfirm._id));
      toast.error(`Order #${deleteConfirm._id.slice(-8).toUpperCase()} deleted`);
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-(--color-primary-600)" />
          </div>
          <h1 className="text-2xl font-bold text-theme-primary">Orders</h1>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search by order ID or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 rounded-lg bg-theme-card border border-theme-primary
            text-theme-primary placeholder:text-theme-muted
            focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
            transition-all duration-200"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 border-(--color-error-500) bg-(--color-error-50)">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-(--color-error-500)" />
            <p className="text-(--color-error-600)">{error}</p>
          </div>
        </div>
      )}

      {/* Orders - Mobile Cards & Desktop Table */}
      {filteredOrders.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="card p-4 hover:shadow-theme-md transition-all duration-200"
              >
                <div className="flex gap-4 items-start">
                  {/* Order Icon */}
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-700) flex items-center justify-center shadow-md shrink-0">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-theme-primary">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <p className="text-xs text-theme-tertiary mt-1 truncate">
                      {order.user?.name || "Unknown Customer"}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-(--color-primary-600)">
                        ${order.totalPrice?.toLocaleString()}
                      </p>
                      <p className="text-xs text-theme-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-theme-primary flex gap-2">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                      bg-(--color-primary-100) text-(--color-primary-600) font-medium
                      hover:bg-(--color-primary-600) hover:text-white transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(order)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                      bg-(--color-error-50) text-(--color-error-600) font-medium
                      hover:bg-(--color-error-600) hover:text-white transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-theme">
                  <thead>
                    <tr>
                      <th className="text-left p-4">Order</th>
                      <th className="text-left p-4 hidden md:table-cell">Customer</th>
                      <th className="text-left p-4">Total</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-theme-tertiary transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-theme-primary">
                              #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs text-theme-tertiary flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div>
                            <p className="font-medium text-theme-primary">{order.user?.name}</p>
                            <p className="text-xs text-theme-tertiary">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-(--color-primary-600) flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${order.totalPrice?.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                                bg-(--color-primary-100) text-(--color-primary-600) font-medium text-sm
                                hover:bg-(--color-primary-600) hover:text-white transition-all duration-200"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(order)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                                bg-(--color-error-50) text-(--color-error-600) font-medium text-sm
                                hover:bg-(--color-error-600) hover:text-white transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-theme-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-theme-primary mb-2">No orders found</h2>
          <p className="text-theme-tertiary">
            {searchTerm ? "Try a different search term" : "Orders will appear here when placed"}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Order"
      >
        <div className="space-y-4">
          <p className="text-theme-secondary">
            Are you sure you want to delete order <strong className="text-theme-primary">#{deleteConfirm?._id?.slice(-8).toUpperCase()}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 btn-secondary py-2.5 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteOrder}
              className="flex-1 btn-error py-2.5 rounded-lg font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;
