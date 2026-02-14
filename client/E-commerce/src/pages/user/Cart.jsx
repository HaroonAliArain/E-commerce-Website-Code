import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart, increaseQty, decreaseQty } from "../../features/cart/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ShoppingBag, Trash2, ArrowRight, Plus, Minus, Package, Truck, ImageOff } from "lucide-react";
import Loader from "../../components/ui/Loader";
import BackButton from "../../components/ui/BackButton";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, loading } = useSelector((state) => state.cart);

  // Calculate totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = 10; // Fixed $10 shipping
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = itemsPrice + shippingPrice;

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  const handleRemoveFromCart = (itemId, itemName) => {
    dispatch(removeFromCart(itemId));
    toast.error(`${itemName} removed from cart`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.error("Cart cleared!");
  };

  if (loading) return <Loader text="Loading cart..." />;

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-(--color-primary-600)" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">My Cart</h1>
        </div>

        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-(--color-error-600) 
              hover:bg-(--color-error-50) transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-theme-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-theme-primary mb-2">Your cart is empty</h2>
          <p className="text-theme-tertiary mb-6">Looks like you haven't added any products yet.</p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      ) : (
        /* Main Cart Card - Contains everything */
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* Cart Items Section */}
            <div className="lg:col-span-2 p-6 pb-12 border-b lg:border-b-0 lg:border-r border-theme-primary">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 group cursor-default">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h2 className="text-base sm:text-lg font-semibold text-theme-primary">Cart Items</h2>
                <span className="text-xs sm:text-sm text-theme-tertiary">({totalItems} items)</span>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="p-4 rounded-xl bg-theme-tertiary">
                    {/* Responsive Layout: Stacked on mobile, horizontal on md+ */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">

                      {/* Image + Info Row */}
                      <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
                        {/* Product Image */}
                        <Link to={`/products/${item._id}`} className="shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 md:w-20 md:h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 md:w-20 md:h-20 rounded-lg bg-theme-secondary flex items-center justify-center">
                              <ImageOff className="w-5 h-5 md:w-6 md:h-6 text-theme-muted" />
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 text-center md:text-left">
                          <Link
                            to={`/products/${item._id}`}
                            className="font-semibold text-theme-primary hover:text-(--color-primary-600) transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-(--color-primary-600) font-bold mt-1">
                            ${item.price?.toFixed(2)}
                          </p>
                          <p className="text-xs text-theme-tertiary mt-1">
                            Subtotal: <span className="font-semibold text-theme-primary">${(item.price * item.quantity).toFixed(2)}</span>
                          </p>
                        </div>
                      </div>

                      {/* Quantity + Delete: Below on mobile, inline on md+ */}
                      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-theme-primary/20">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 px-2 py-1 md:py-1.5 rounded-lg border border-theme-primary bg-theme-card">
                          <button
                            onClick={() => dispatch(decreaseQty(item._id))}
                            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-md
                              bg-(--color-accent-500) text-white hover:bg-(--color-accent-600) transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          </button>
                          <span className="w-6 md:w-8 text-center font-bold text-theme-primary text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQty(item._id))}
                            className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-md
                              bg-(--color-accent-500) text-white hover:bg-(--color-accent-600) transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 md:w-3.5 md:h-3.5" />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveFromCart(item._id, item.name)}
                          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg
                            bg-(--color-error-500) text-white hover:bg-(--color-error-600) transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1 p-4 sm:p-6 pt-4 lg:pt-4 sm:pt-6 lg:mt-0 bg-theme-secondary border-t lg:border-t-0 border-theme-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 group cursor-default">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h2 className="text-base sm:text-lg font-semibold text-theme-primary">Order Summary</h2>
              </div>

              <div className="space-y-4">
                {/* Summary Items */}
                <div className="space-y-3 pb-4 border-b border-theme-primary">
                  <div className="flex justify-between text-theme-secondary">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-medium text-theme-primary">${itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-theme-secondary">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-theme-primary">${shippingPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between py-3 text-xl font-bold text-theme-primary">
                  <span>Total</span>
                  <span className="text-(--color-primary-600)">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Shipping Badge */}
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-(--color-primary-50) text-(--color-primary-700) text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Standard Shipping - $10.00</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={checkoutHandler}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base mt-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Continue Shopping Link */}
                <Link
                  to="/products"
                  className="block w-full text-center mt-2 text-(--color-primary-600) hover:underline text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
