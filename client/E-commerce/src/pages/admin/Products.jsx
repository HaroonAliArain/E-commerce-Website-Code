import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../features/product/productSlice";
import { Link } from "react-router-dom";
import { Package, Plus, Pencil, Trash2, AlertCircle, Search } from "lucide-react";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import api from "../../services/api";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  // Delete Product Handler
  const handleDelete = async () => {
    if (!deleteProduct) return;

    setDeleting(true);
    try {
      await api.delete(`/api/products/${deleteProduct._id}`);
      dispatch(getAllProducts());
      toast.error(`${deleteProduct.name} deleted`);
      setDeleteProduct(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <Package className="w-5 h-5 text-(--color-primary-600)" />
          </div>
          <h1 className="text-2xl font-bold text-theme-primary">Products</h1>
        </div>

        {/* Add Product Button - Date button style with hover effect */}
        <Link
          to="/admin/products/create"
          className="add-product-btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium
            border transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
            e.currentTarget.style.borderColor = 'var(--color-primary-600)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
            e.currentTarget.style.borderColor = 'var(--border-primary)';
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search products..."
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
      {
        error && (
          <div className="card p-4 border-(--color-error-500) bg-(--color-error-50)">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-(--color-error-500)" />
              <p className="text-(--color-error-600)">{error}</p>
            </div>
          </div>
        )
      }

      {/* Products - Mobile Cards & Desktop Table */}
      {
        filteredProducts?.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="card p-4 hover:shadow-theme-md transition-all duration-200"
                >
                  <div className="flex gap-4 items-start">
                    {/* Product Image */}
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-theme-tertiary flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8 text-theme-muted" />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-theme-primary truncate">
                        {product.name}
                      </p>
                      {product.category && (
                        <p className="text-xs text-theme-tertiary mt-0.5">
                          {product.category?.name || product.category}
                        </p>
                      )}
                      <p className="text-lg font-bold text-(--color-primary-600) mt-1">
                        ${product.price?.toLocaleString()}
                      </p>
                      <span className={`inline-block mt-3 px-2.5 py-2 rounded-full text-xs font-medium ${product.stock > 10
                        ? "bg-(--color-success-50) text-(--color-success-600)"
                        : product.stock > 0
                          ? "bg-(--color-accent-100) text-(--color-accent-600)"
                          : "bg-(--color-error-50) text-(--color-error-600)"
                        }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-theme-primary">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                        bg-(--color-primary-100) text-(--color-primary-600) font-medium
                        hover:bg-(--color-primary-600) hover:text-white transition-all duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg
                        bg-(--color-error-50) text-(--color-error-600) font-medium
                        hover:bg-(--color-error-500) hover:text-white transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-theme">
                  <thead>
                    <tr>
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-left p-4">Stock</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-theme-tertiary transition-all duration-200 group cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-theme-tertiary flex items-center justify-center">
                                <Package className="w-5 h-5 text-theme-muted" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-theme-primary truncate group-hover:text-(--color-primary-600) transition-colors">
                                {product.name}
                              </p>
                              {product.category && (
                                <span className="text-xs text-theme-tertiary">
                                  {product.category?.name || product.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-(--color-primary-600)">
                            ${product.price?.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 10
                            ? "bg-(--color-success-50) text-(--color-success-600)"
                            : product.stock > 0
                              ? "bg-(--color-accent-100) text-(--color-accent-600)"
                              : "bg-(--color-error-50) text-(--color-error-600)"
                            }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-2 rounded-lg hover:bg-(--color-primary-100) text-(--color-primary-600) transition-all duration-200 hover:scale-110"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setDeleteProduct(product)}
                              className="p-2 rounded-lg hover:bg-(--color-error-50) text-(--color-error-500) transition-all duration-200 hover:scale-110"
                              title="Delete"
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
          </>
        ) : (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-theme-tertiary flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-theme-muted" />
            </div>
            <h2 className="text-xl font-semibold text-theme-primary mb-2">No products found</h2>
            <p className="text-theme-tertiary mb-6">
              {searchTerm ? "Try a different search term" : "Add your first product to get started"}
            </p>
            {!searchTerm && (
              <Link
                to="/admin/products/create"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium
                bg-(--color-primary-600) text-white
                hover:bg-(--color-primary-700) transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            )}
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        title="Delete Product"
      >
        <div className="space-y-4">
          <p className="text-theme-secondary">
            Are you sure you want to delete <strong className="text-theme-primary">{deleteProduct?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteProduct(null)}
              className="flex-1 py-2.5 rounded-lg font-medium border border-theme-primary text-theme-primary
                hover:bg-theme-tertiary transition-all duration-200"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-lg font-medium bg-(--color-error-500) text-white
                hover:bg-(--color-error-600) transition-all duration-200 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div >
  );
};

export default AdminProducts;
