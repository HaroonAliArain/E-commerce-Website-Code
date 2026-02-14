import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "../../features/cart/cartSlice";
import { Trash2, Plus, Minus } from "lucide-react";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Image */}
        {item.image && (
          <Link to={`/products/${item._id}`} className="shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
            />
          </Link>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/products/${item._id}`}
            className="font-semibold text-theme-primary hover:text-(--color-primary-600) transition-colors block truncate"
          >
            {item.name}
          </Link>
          <p className="text-(--color-primary-600) font-bold text-lg mt-1">
            ${item.price?.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(decreaseQty(item._id))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-theme-primary 
                bg-theme-tertiary hover:bg-theme-secondary text-theme-primary transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-10 text-center font-semibold text-theme-primary">
              {item.quantity}
            </span>

            <button
              onClick={() => dispatch(increaseQty(item._id))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-theme-primary 
                bg-theme-tertiary hover:bg-theme-secondary text-theme-primary transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal & Remove */}
          <div className="flex items-center gap-4">
            <span className="text-theme-secondary text-sm hidden md:block">
              Subtotal: <span className="font-semibold text-theme-primary">${(item.price * item.quantity).toFixed(2)}</span>
            </span>

            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="p-2 rounded-lg text-(--color-error-500) hover:bg-(--color-error-50) transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
