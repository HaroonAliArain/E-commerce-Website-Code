import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails, clearProductDetails } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { ShoppingCart, Package, CheckCircle, ArrowRight, ImageOff, Star, Tag, Boxes, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

// UI Components
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import BackButton from "../../components/ui/BackButton";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.products);

  // Modal state for Add to Cart confirmation
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProductDetails(id));

    // Clear product when leaving page
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const addToCartHandler = () => {
    if (product.stock <= 0) return;

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
      })
    );

    toast.success(`${product.name} added to cart!`);
    // Open confirmation modal instead of immediate navigation
    setModalOpen(true);
  };

  const goToCart = () => {
    setModalOpen(false);
    navigate("/cart");
  };

  const isInStock = product?.stock > 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton />

      {/* Page Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
          <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-(--color-primary-600)" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Product</h1>
      </div>

      {loading && <Loader text="Loading product details..." />}

      {error && (
        <div className="card p-6 text-center">
          <p className="text-(--color-error-500) font-medium">{error}</p>
        </div>
      )}

      {!loading && product && (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

            {/* Product Image Section */}
            <div className="bg-theme-tertiary p-4 sm:p-6">
              {product.image ? (
                <div className="w-full h-70 sm:h-87.5 lg:h-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="h-70 sm:h-87.5 lg:h-100 w-full flex flex-col items-center justify-center text-theme-muted rounded-xl bg-theme-secondary">
                  <ImageOff className="w-12 h-12 sm:w-16 sm:h-16 mb-3" />
                  <span className="text-base sm:text-lg">No Image Available</span>
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="p-6 lg:p-8 flex flex-col">

              {/* Product Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-theme-primary mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating Stars */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-(--color-accent-400) fill-(--color-accent-400)"
                    />
                  ))}
                </div>
                <span className="text-sm text-theme-tertiary">(5.0)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <p className="text-3xl lg:text-4xl font-bold text-(--color-primary-600)">
                  ${product.price?.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-theme-primary uppercase tracking-wider mb-2">
                    Description
                  </h3>
                  <p className="text-theme-secondary leading-relaxed text-sm lg:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-theme-tertiary">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-(--color-primary-100) flex items-center justify-center">
                    <Tag className="w-5 h-5 text-(--color-primary-600)" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-theme-tertiary">Category</p>
                    <p className="text-sm font-medium text-theme-primary truncate">
                      {product.category?.name || product.category || "Uncategorized"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-theme-tertiary">
                  <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center
                    ${isInStock ? "bg-(--color-success-50)" : "bg-(--color-error-50)"}`}>
                    <Boxes className={`w-5 h-5 ${isInStock ? "text-(--color-success-600)" : "text-(--color-error-600)"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-theme-tertiary">Availability</p>
                    <p className={`text-sm font-medium truncate ${isInStock ? "text-(--color-success-600)" : "text-(--color-error-600)"}`}>
                      {isInStock ? `${product.stock} Available` : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-6 py-4 border-y border-theme-primary">
                <div className="flex items-center gap-2 text-sm text-theme-secondary">
                  <Truck className="w-4 h-4 text-(--color-primary-600)" />
                  <span>Low Shipping Fee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-theme-secondary">
                  <Shield className="w-4 h-4 text-(--color-primary-600)" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-theme-secondary">
                  <RotateCcw className="w-4 h-4 text-(--color-primary-600)" />
                  <span>Easy Returns</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                <button
                  onClick={addToCartHandler}
                  disabled={!isInStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200
                    ${isInStock
                      ? "btn-primary hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      : "bg-theme-tertiary text-theme-muted cursor-not-allowed"}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base"
                >
                  <Package className="w-5 h-5" />
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !product && !error && (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-theme-muted mx-auto mb-4" />
          <p className="text-theme-tertiary text-lg">Product not found</p>
        </div>
      )}

      {/* Add-to-Cart Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title=""
      >
        <div className="py-2">
          {/* Success Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-(--color-success-50) flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-(--color-success-500)" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-theme-primary">Added to Cart!</h3>
              <p className="text-sm text-theme-tertiary">Item successfully added</p>
            </div>
          </div>

          {/* Product Card Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-theme-tertiary mb-6">
            {product?.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-theme-primary truncate">{product?.name}</p>
              <p className="text-lg font-bold text-(--color-primary-600) mt-1">
                ${product?.price?.toFixed(2)}
              </p>
              <p className="text-sm text-theme-tertiary">Qty: 1</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={goToCart}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="btn-secondary flex-1 py-3 rounded-xl font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductDetails;
