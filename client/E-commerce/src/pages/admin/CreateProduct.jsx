import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../features/category/categorySlice";
import { useNavigate } from "react-router-dom";
import { Package, Upload, AlertCircle } from "lucide-react";
import Loader from "../../components/ui/Loader";
import BackButton from "../../components/ui/BackButton";
import api from "../../services/api";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories = [], loading } = useSelector(
    (state) => state.category
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Please select an image");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock", stock);
      formData.append("image", image);

      await api.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploading(false);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      setUploading(false);
      toast.error(err.response?.data?.message || "Product creation failed");
      setError(err.response?.data?.message || "Product creation failed");
    }
  };

  if (loading) return <Loader text="Loading categories..." />;

  return (
    <div className="lg:relative">
      {/* Back Button - Top on mobile, Left side on large screens */}
      <div className="lg:hidden mb-6">
        <BackButton />
      </div>
      <div className="hidden lg:block lg:absolute lg:left-0 lg:top-0">
        <BackButton />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="card p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
              <Package className="w-5 h-5 text-(--color-primary-600)" />
            </div>
            <h1 className="text-2xl font-bold text-theme-primary">
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline">Product</span>
            </h1>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-(--color-error-50) border border-(--color-error-200)">
              <div className="flex items-center gap-2 text-(--color-error-600)">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                text-theme-primary placeholder:text-theme-muted
                focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Enter product description"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                text-theme-primary placeholder:text-theme-muted
                focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                transition-all duration-200 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                  text-theme-primary placeholder:text-theme-muted
                  focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                  transition-all duration-200"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                  text-theme-primary placeholder:text-theme-muted
                  focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                  transition-all duration-200"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                Category
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                text-theme-primary
                focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                transition-all duration-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                Product Image
              </label>
              <div className="border-2 border-dashed border-theme-primary rounded-lg p-6 text-center hover:border-(--color-primary-500) transition-colors">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-(--color-error-600) hover:underline"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="w-10 h-10 text-theme-muted mx-auto mb-2" />
                    <p className="text-theme-secondary font-medium">Click to upload image</p>
                    <p className="text-sm text-theme-tertiary mt-1">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full btn-primary py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {uploading ? "Creating Product..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
