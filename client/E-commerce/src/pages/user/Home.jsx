import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../../features/product/productSlice";
import { getAllCategories } from "../../features/category/categorySlice";
import ProductCard from "../../components/ui/ProductCard";
import Loader from "../../components/ui/Loader";
import { Search, X, ShoppingBag, Truck, Shield, Headphones, Package, Grid3X3 } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { products, loading: productLoading, error: productError } = useSelector(
    (state) => state.products
  );
  const { categories, loading: categoryLoading, error: categoryError } = useSelector(
    (state) => state.category
  );

  // Local state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products and categories
  useEffect(() => {
    dispatch(getAllProducts(selectedCategory));
    dispatch(getAllCategories());
  }, [dispatch, selectedCategory]);

  // Filter products by search and category
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" ||
      product.category?.name === selectedCategory ||
      product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(categoryName);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Using website primary colors (Indigo - Darker) */}
      <section className="relative mt-6 rounded-2xl overflow-hidden bg-linear-to-br from-(--color-primary-600) via-(--color-primary-700) to-(--color-primary-900)">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-white blur-sm"></div>
          <div className="absolute bottom-6 right-6 w-32 h-32 rounded-full bg-white blur-sm"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-yellow-300"></div>
        </div>

        {/* Reduced padding for smaller card */}
        <div className="relative px-6 sm:px-10 md:px-14 py-10 sm:py-12 md:py-14">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-4 border border-white/30">
              <ShoppingBag className="w-4 h-4" />
              Premium Quality Products
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight" style={{ color: '#ffffff' }}>
              Discover Your Perfect
              <span className="block text-yellow-300 mt-1">Shopping Experience</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg max-w-lg mx-auto mb-6 font-medium" style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Shop the latest trends with confidence. Quality products, unbeatable prices.
            </p>

            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-(--color-primary-700) font-bold text-base
                hover:bg-(--color-accent-400) hover:text-(--color-primary-900) transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Shopping
            </button>
          </div>
        </div>

        {/* Feature Pills with Hover Effects */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/30
              hover:bg-white hover:text-(--color-primary-700) hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Truck className="w-4 h-4" />
              Low Shipping Fee
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/30
              hover:bg-white hover:text-(--color-primary-700) hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Shield className="w-4 h-4" />
              Secure Payment
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/30
              hover:bg-white hover:text-(--color-primary-700) hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Headphones className="w-4 h-4" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Shadow Divider - Visible separator between hero and products */}
      <div className="my-12 py-4">
        <div className="h-1 bg-linear-to-r from-transparent via-(--color-primary-300) to-transparent rounded-full shadow-md"></div>
      </div>

      {/* Product Showcase Section */}
      <section className="space-y-8">
        {/* Section Heading - Golden/Amber like Hero */}
        <div className="text-center">
          <h2 className="font-bold mb-2" style={{ color: '#fbbf24', fontSize: '2.5rem' }}>
            Explore Our Products
          </h2>
          <p className="text-theme-tertiary text-sm sm:text-base max-w-xl mx-auto">
            Find exactly what you're looking for from our wide range of quality products
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center px-4 mb-8">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl bg-theme-card border-2 border-theme-secondary 
                text-theme-primary placeholder:text-theme-muted text-lg
                focus:border-(--color-primary-500) focus:ring-4 focus:ring-(--color-primary-500)/20
                transition-all duration-200 shadow-theme-md"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-theme-muted" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-theme-tertiary transition-colors"
              >
                <X className="w-5 h-5 text-theme-muted" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Section */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-theme-primary flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-(--color-primary-600)" />
              </div>
              <span className="sm:hidden">Categories</span>
              <span className="hidden sm:inline">Shop by Category</span>
            </h2>
          </div>

          {categoryLoading && <Loader size="small" />}
          {categoryError && (
            <p className="text-(--color-error-500) text-center py-4">{categoryError}</p>
          )}

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* All Products Button */}
            <button
              onClick={() => setSelectedCategory("")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
              min-w-35 h-12 transition-all duration-200
              ${selectedCategory === ""
                  ? "bg-(--color-primary-600) text-white shadow-lg shadow-(--color-primary-600)/30"
                  : "bg-theme-card border-2 border-theme-secondary text-theme-primary hover:border-(--color-primary-500) hover:text-(--color-primary-600)"
                }`}
            >
              <Package className="w-5 h-5" />
              All Products
            </button>

            {/* Category Buttons */}
            {!categoryLoading &&
              categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm
                  min-w-35 h-12 transition-all duration-200
                  ${selectedCategory === cat.name
                      ? "bg-(--color-primary-600) text-white shadow-lg shadow-(--color-primary-600)/30"
                      : "bg-theme-card border-2 border-theme-secondary text-theme-primary hover:border-(--color-primary-500) hover:text-(--color-primary-600)"
                    }`}
                >
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-5 h-5 rounded object-cover" />
                  ) : (
                    <Package className="w-5 h-5" />
                  )}
                  {cat.name}
                </button>
              ))}
          </div>
        </section>

        {/* Products Section - Added top margin for spacing */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-theme-primary">
              {selectedCategory ? `${selectedCategory}` : "All Products"}
              {filteredProducts?.length > 0 && (
                <span className="ml-3 text-base font-normal text-theme-tertiary">
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                bg-(--color-error-50) text-(--color-error-600) hover:bg-(--color-error-100)
                transition-colors"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </button>
            )}
          </div>

          {productLoading && <Loader text="Loading products..." />}

          {productError && (
            <div className="card p-6 text-center">
              <p className="text-(--color-error-500) font-medium">{productError}</p>
            </div>
          )}

          {!productLoading && filteredProducts?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {!productLoading && filteredProducts?.length === 0 && (
            <div className="card p-16 text-center">
              <ShoppingBag className="w-16 h-16 text-theme-muted mx-auto mb-4" />
              <p className="text-theme-primary text-xl font-semibold mb-2">No products found</p>
              <p className="text-theme-tertiary">
                {selectedCategory
                  ? `No products available in "${selectedCategory}" category`
                  : "Try adjusting your search terms"
                }
              </p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="mt-4 px-6 py-2 rounded-lg btn-primary"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default Home;
