import React, { useState } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../features/cart/cartSlice";
import api from "../../services/api";
import BackButton from "../../components/ui/BackButton";
import { CreditCard, Truck, MapPin, Package, ArrowRight, Loader2 } from "lucide-react";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping & Method, 2: Card Payment

  // Calculate totals
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = 10;
  const totalPrice = itemsPrice + shippingPrice;

  // Handle shipping form input
  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // Validate shipping form
  const validateShipping = () => {
    const { address, city, postalCode, country } = shippingAddress;
    if (!address || !city || !postalCode || !country) {
      toast.error("Please fill in all shipping address fields");
      return false;
    }
    return true;
  };

  // Create order
  const createOrder = async () => {
    const orderItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const { data } = await api.post("/api/orders", {
      orderItems,
      shippingAddress,
      paymentMethod,
    });

    return data.order;
  };

  // Handle Place Order button click
  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Create order first
      const order = await createOrder();

      if (paymentMethod === "Cash payment") {
        // COD - Order is placed, navigate to orders
        dispatch(clearCart());
        toast.success("Order placed successfully! 🎉");
        navigate("/profile/orders");
      } else {
        // Stripe payment - move to step 2
        setStep(2);

        // Create payment intent
        const { data } = await api.post("/api/payment/create-payment-intent", {
          orderId: order._id,
        });

        setClientSecret(data.clientSecret);
        setOrderId(order._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // State for Stripe payment
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");

  // Handle Stripe payment
  const handleStripePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet");
      return;
    }

    setLoading(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed. Please try again.");

      // Cancel/delete the order since payment failed
      try {
        await api.delete(`/api/orders/${orderId}/cancel`);
      } catch (deleteError) {
        console.error("Failed to cancel order:", deleteError);
      }

      // Reset order state and navigate back to step 1
      setClientSecret("");
      setOrderId("");
      setLoading(false);
      setStep(1);
      return;
    }

    // Payment successful - update order
    try {
      await api.put(`/api/orders/${orderId}/pay`, { paymentIntent });
      dispatch(clearCart());
      toast.success("Payment Successful! 🎉");
      navigate("/profile/orders");
    } catch (err) {
      toast.error("Failed to update order status");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty
  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="space-y-6">
        <BackButton />
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 text-theme-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-theme-primary mb-2">Your cart is empty</h2>
          <p className="text-theme-tertiary mb-6">Add some products before checkout.</p>
          <button
            onClick={() => navigate("/products")}
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {step === 1 && <BackButton />}

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-(--color-primary-600)" />
        </div>
        <h1 className="text-2xl font-bold text-theme-primary">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 pb-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-(--color-primary-600)' : 'text-theme-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-(--color-primary-600) text-white' : 'bg-theme-tertiary text-theme-muted'}`}>
            1
          </div>
          <span className="font-medium hidden sm:inline">Shipping & Payment</span>
        </div>
        <div className="flex-1 h-1 bg-theme-tertiary rounded-full">
          <div className={`h-full bg-(--color-primary-600) rounded-full transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-(--color-primary-600)' : 'text-theme-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-(--color-primary-600) text-white' : 'bg-theme-tertiary text-theme-muted'}`}>
            2
          </div>
          <span className="font-medium hidden sm:inline">Card Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <>
              {/* Shipping Address */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-6 group cursor-default">
                  <MapPin className="w-5 h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                  <h2 className="text-lg font-semibold text-theme-primary">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-theme-secondary mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-theme-primary bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500)"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-theme-primary bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500)"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-secondary mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-theme-primary bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500)"
                      placeholder="Postal Code"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-theme-secondary mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-theme-primary bg-theme-card text-theme-primary focus:outline-none focus:ring-2 focus:ring-(--color-primary-500)"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-6 group cursor-default">
                  <CreditCard className="w-5 h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                  <h2 className="text-lg font-semibold text-theme-primary">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "Stripe"
                      ? "border-(--color-primary-600) bg-theme-secondary"
                      : "border-theme-primary hover:border-(--color-primary-300) hover:bg-theme-tertiary"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Stripe"
                      checked={paymentMethod === "Stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-(--color-primary-600)"
                    />
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-(--color-primary-600)" />
                      <div>
                        <p className="font-medium text-theme-primary">Card Payment</p>
                        <p className="text-sm text-theme-tertiary">Pay securely with Stripe</p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "Cash payment"
                      ? "border-(--color-primary-600) bg-theme-secondary"
                      : "border-theme-primary hover:border-(--color-primary-300) hover:bg-theme-tertiary"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash payment"
                      checked={paymentMethod === "Cash payment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-(--color-primary-600)"
                    />
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-(--color-primary-600)" />
                      <div>
                        <p className="font-medium text-theme-primary">Cash on Delivery</p>
                        <p className="text-sm text-theme-tertiary">Pay when you receive</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* Step 2: Card Payment */
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-6 group cursor-default">
                <CreditCard className="w-5 h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h2 className="text-lg font-semibold text-theme-primary">Card Details</h2>
              </div>

              {/* Show loading while waiting for payment intent */}
              {!clientSecret ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-10 h-10 animate-spin text-(--color-primary-600) mb-4" />
                  <p className="text-theme-secondary">Preparing secure payment...</p>
                </div>
              ) : (
                <form onSubmit={handleStripePayment}>
                  <div className="space-y-4 mb-6">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-theme-secondary mb-2">
                        Card Number
                      </label>
                      <div className="p-3.5 rounded-lg border border-theme-primary bg-white">
                        <CardNumberElement
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#32325d",
                                fontFamily: "system-ui, sans-serif",
                                "::placeholder": { color: "#aab7c4" },
                              },
                              invalid: {
                                color: "#dc2626",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* Expiry & CVC Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-2">
                          Expiry Date
                        </label>
                        <div className="p-3.5 rounded-lg border border-theme-primary bg-white">
                          <CardExpiryElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#32325d",
                                  fontFamily: "system-ui, sans-serif",
                                  "::placeholder": { color: "#aab7c4" },
                                },
                                invalid: {
                                  color: "#dc2626",
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-theme-secondary mb-2">
                          CVC
                        </label>
                        <div className="p-3.5 rounded-lg border border-theme-primary bg-white">
                          <CardCvcElement
                            options={{
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#32325d",
                                  fontFamily: "system-ui, sans-serif",
                                  "::placeholder": { color: "#aab7c4" },
                                },
                                invalid: {
                                  color: "#dc2626",
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setClientSecret("");
                      }}
                      className="w-full sm:flex-1 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl font-semibold text-sm sm:text-base border border-theme-primary text-theme-primary hover:bg-theme-secondary transition-colors"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!stripe || loading}
                      className="w-full sm:flex-1 btn-primary flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay ${totalPrice.toFixed(2)}
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <p className="text-center text-sm text-theme-tertiary mt-4">
                Test card: 4242 4242 4242 4242 | Any future date | Any CVC
              </p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6 group cursor-default">
              <Package className="w-5 h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
              <h2 className="text-lg font-semibold text-theme-primary">Order Summary</h2>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 p-3 rounded-lg bg-theme-tertiary">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-theme-primary text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-theme-tertiary">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 py-4 border-t border-theme-primary">
              <div className="flex justify-between text-theme-secondary">
                <span>Subtotal</span>
                <span className="font-medium text-theme-primary">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Shipping</span>
                <span className="font-medium text-theme-primary">${shippingPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between py-4 border-t border-theme-primary text-xl font-bold text-theme-primary">
              <span>Total</span>
              <span className="text-(--color-primary-600)">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Place Order Button (Step 1 only) */}
            {step === 1 && (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "Stripe" ? "Continue to Payment" : "Place Order"}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
