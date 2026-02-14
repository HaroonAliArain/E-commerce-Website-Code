import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tag, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import { toast } from "react-toastify";
import {
  getAllCategories,
  addCategory,
  editCategory,
  removeCategory,
} from "../../features/category/categorySlice";

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.category
  );

  const [showModal, setShowModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [name, setName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // CREATE
  const handleCreate = () => {
    if (!name.trim()) return;
    dispatch(addCategory(name));
    toast.success("Category created successfully!");
    setShowModal(false);
    setName("");
  };

  // UPDATE
  const handleUpdate = () => {
    if (!currentCategory || !currentCategory._id) return;

    dispatch(
      editCategory({
        id: currentCategory._id,
        name,
      })
    );
    toast.success("Category updated successfully!");

    setShowModal(false);
    setCurrentCategory(null);
    setName("");
  };

  // DELETE
  const handleDelete = (id, catName) => {
    dispatch(removeCategory(id));
    toast.error(`${catName} deleted`);
    setDeleteConfirm(null);
  };

  // OPEN EDIT MODAL
  const openEditModal = (category) => {
    setCurrentCategory(category);
    setName(category.name);
    setShowModal(true);
  };

  if (loading) return <Loader text="Loading categories..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <Tag className="w-5 h-5 text-(--color-primary-600)" />
          </div>
          <h1 className="text-2xl font-bold text-theme-primary">Categories</h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentCategory(null);
            setName("");
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium
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
          Add Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card p-4 border-(--color-error-500) bg-(--color-error-50)">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-(--color-error-500)" />
            <p className="text-(--color-error-600)">{error}</p>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="card p-12 text-center">
          <Tag className="w-16 h-16 text-theme-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-theme-primary mb-2">No categories yet</h2>
          <p className="text-theme-tertiary mb-6">Create your first category to organize products.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="card p-4 hover:shadow-theme-md transition-all duration-200"
              >
                <div className="flex gap-4 items-center">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-700) 
                    flex items-center justify-center shadow-md shrink-0">
                    <Tag className="w-6 h-6 text-white" />
                  </div>

                  {/* Category Name & Actions */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-theme-primary truncate">{cat.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                          bg-(--color-primary-100) text-(--color-primary-600)
                          hover:bg-(--color-primary-600) hover:text-white transition-all duration-200"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(cat)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium
                          bg-(--color-error-50) text-(--color-error-500)
                          hover:bg-(--color-error-500) hover:text-white transition-all duration-200"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Grid View */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="card p-6 hover:shadow-theme-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Gradient Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-700) 
                    flex items-center justify-center shadow-lg mb-4
                    group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    <Tag className="w-8 h-8 text-white" />
                  </div>

                  {/* Category Name */}
                  <h3 className="font-semibold text-theme-primary text-base mb-4 truncate w-full">{cat.name}</h3>

                  {/* Action Buttons */}
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg 
                        bg-(--color-primary-100) text-(--color-primary-600) font-medium text-sm
                        hover:bg-(--color-primary-600) hover:text-white transition-all duration-200"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(cat)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg 
                        bg-(--color-error-50) text-(--color-error-500) font-medium text-sm
                        hover:bg-(--color-error-500) hover:text-white transition-all duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={currentCategory ? "Update Category" : "Add Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-theme-primary border border-theme-primary
                text-theme-primary placeholder:text-theme-muted
                focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                transition-all duration-200"
              placeholder="Enter category name"
            />
          </div>

          <button
            type="button"
            onClick={currentCategory ? handleUpdate : handleCreate}
            className="w-full btn-primary py-2.5 rounded-lg font-medium"
          >
            {currentCategory ? "Update Category" : "Create Category"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-theme-secondary">
            Are you sure you want to delete <strong className="text-theme-primary">{deleteConfirm?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 btn-secondary py-2.5 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm._id, deleteConfirm.name)}
              className="flex-1 btn-error py-2.5 rounded-lg font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
