import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Upload, AlertCircle, Star } from "lucide-react";
import api from "../../services/api";
import Loader from "../../components/ui/Loader";
import BackButton from "../../components/ui/BackButton";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  // Data States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch Product + Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const productRes = await api.get(`/api/products/${id}`);
        const product = productRes.data.product;

        const categoryRes = await api.get(`/api/categories/all`);
        const allCategories = categoryRes.data.categories || [];

        setName(product?.name || "");
        setDescription(product?.description || "");
        setPrice(product?.price?.toString() || "");
        setStock(product?.stock?.toString() || "");
        setCategory(product?.category?._id || "");
        setIsFeatured(product?.isFeatured || false);
        setExistingImage(product?.image || "");

        setCategories(allCategories);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price ? Number(price) : 0);
      formData.append("stock", stock ? Number(stock) : 0);
      formData.append("category", category);
      formData.append("isFeatured", isFeatured);

      if (image) {
        formData.append("image", image);
      }

      await api.put(`/api/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Product update failed");
      setError(err.response?.data?.message || "Product update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading product..." />;

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
              <Pencil className="w-5 h-5 text-(--color-primary-600)" />
            </div>
            <h1 className="text-2xl font-bold text-theme-primary">
              <span className="sm:hidden">Edit</span>
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

            {/* Featured Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-theme-tertiary">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 text-(--color-primary-600) rounded"
              />
              <label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                <Star className="w-5 h-5 text-(--color-accent-500)" />
                <span className="font-medium text-theme-primary">Featured Product</span>
              </label>
            </div>

            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-1.5">
                Product Image
              </label>

              {/* Current Image */}
              {(imagePreview || existingImage) && (
                <div className="mb-4">
                  <p className="text-xs text-theme-tertiary mb-2">
                    {imagePreview ? "New image preview:" : "Current image:"}
                  </p>
                  <img
                    src={imagePreview || existingImage}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-lg border border-theme-primary"
                  />
                </div>
              )}

              {/* Upload New */}
              <div className="border-2 border-dashed border-theme-primary rounded-lg p-4 text-center hover:border-(--color-primary-500) transition-colors">
                <label className="cursor-pointer">
                  <Upload className="w-8 h-8 text-theme-muted mx-auto mb-2" />
                  <p className="text-theme-secondary font-medium">
                    {existingImage ? "Upload new image (optional)" : "Click to upload image"}
                  </p>
                  <p className="text-sm text-theme-tertiary mt-1">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 rounded-lg font-medium disabled:opacity-50"
            >
              {submitting ? "Updating Product..." : "Update Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
