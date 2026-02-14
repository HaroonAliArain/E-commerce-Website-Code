import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../features/product/productSlice";
import { Package } from "lucide-react";

// UI Components
import ProductCard from "../../components/ui/ProductCard";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import BackButton from "../../components/ui/BackButton";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error, count, perPage } = useSelector(
    (state) => state.products
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Calculate total pages (optional if backend returns total pages)
  const totalPages = Math.ceil(count / perPage) || 1;

  return (
    <div className="space-y-6">
      <BackButton />
      {/* Page Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-(--color-primary-600)" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Products</h1>
      </div>

      {/* Loading */}
      {loading && <Loader text="Loading products..." />}

      {/* Error */}
      {error && (
        <div className="card p-6 text-center">
          <p className="text-(--color-error-500) font-medium">{error}</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products?.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && products?.length === 0 && (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-theme-muted mx-auto mb-4" />
          <p className="text-theme-tertiary text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Products;
