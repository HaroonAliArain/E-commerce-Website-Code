import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { ShoppingCart, Eye, ImageOff, Star } from "lucide-react";
import { toast } from "react-toastify";

const ProductCard = ({ product, showAddToCart = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    navigate("/cart");
  };

  const isInStock = product.stock > 0;

  return (
    <div className="group relative bg-theme-card rounded-2xl overflow-hidden border border-theme-primary 
      shadow-theme-sm hover:shadow-theme-lg transition-all duration-300 hover:-translate-y-1">

      {/* Image Container */}
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-theme-tertiary text-theme-muted">
            <ImageOff className="w-12 h-12 mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick View Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg 
            bg-white/95 backdrop-blur-sm text-(--color-primary-700) font-medium text-sm
            hover:bg-white transition-colors">
            <Eye className="w-4 h-4" />
            Quick View
          </span>
        </div>

        {/* Category Badge - Top Left */}
        {product.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium
            bg-white/90 backdrop-blur-sm text-(--color-primary-700) shadow-sm">
            {product.category?.name || product.category}
          </span>
        )}

        {/* Stock Status - Top Right */}
        {!isInStock && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium
            bg-(--color-error-500) text-white">
            Out of Stock
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <Link to={`/products/${product._id}`}>
          <h2 className="text-base font-semibold text-theme-primary line-clamp-2 min-h-12
            hover:text-(--color-primary-600) transition-colors leading-tight">
            {product.name}
          </h2>
        </Link>

        {/* Product Description - Short preview with fixed height for alignment */}
        <div className="h-5 mt-2">
          {product.description && (
            <p className="text-sm text-theme-secondary line-clamp-1">
              {product.description.split(' ').length > 12
                ? product.description.split(' ').slice(0, 12).join(' ') + '...'
                : product.description}
            </p>
          )}
        </div>

        {/* Rating Placeholder (can be enhanced later) */}
        <div className="flex items-center gap-1 mt-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-4 h-4 text-(--color-accent-400) fill-(--color-accent-400)"
            />
          ))}
          <span className="text-xs text-theme-tertiary ml-1">(5.0)</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-xl font-bold text-(--color-primary-600)">
              ${product.price?.toFixed(2)}
            </p>
          </div>

          {showAddToCart && (
            <button
              onClick={addToCartHandler}
              disabled={!isInStock}
              className={`p-3 rounded-xl transition-all duration-200 
                ${isInStock
                  ? "bg-(--color-primary-600) text-white hover:bg-(--color-primary-700) hover:scale-105 shadow-md hover:shadow-lg"
                  : "bg-theme-tertiary text-theme-muted cursor-not-allowed"
                }`}
              title={isInStock ? "Add to Cart" : "Out of Stock"}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
