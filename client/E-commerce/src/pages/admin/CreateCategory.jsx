import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/Loader";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setSuccess("Category created successfully!");
      setName("");
      setLoading(false);
      // Optionally redirect to categories list
      navigate("/admin/categories");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category");
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Category</h1>

        {loading && <Loader />}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="max-w-md">
          <label className="block mb-2 font-semibold">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Category
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateCategory;
