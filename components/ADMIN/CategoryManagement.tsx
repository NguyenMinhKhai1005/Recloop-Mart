import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchCategories,
  createCategory as createCategoryThunk,
  updateCategory as updateCategoryThunk,
  deleteCategory as deleteCategoryThunk,
} from "../../redux/slices/categorySlice";
import type { Category, CategoryRequest } from "../../service/categoryService";

const CategoryManagement = () => {
  // const [categories] = useState<Category[]>([]); // Not used, replaced by redux
  // const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState<CategoryRequest>({
    name: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Get auth token from localStorage/sessionStorage
  const getAuthToken = () => {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Redux state
  const dispatch = useAppDispatch();
  const categoryState = useAppSelector(
    (state: { category: { categories: Category[]; loading: boolean } }) =>
      state.category
  );

  // Fetch categories using redux
  const fetchCategoriesRedux = async () => {
    const token = getAuthToken();
    if (!token) {
      showMessage("error", "Unauthorized access. Please login again.");
      return;
    }
    await dispatch(fetchCategories(token));
  };

  // Create new category
  const createCategory = async () => {
    if (!newCategory.name.trim()) {
      showMessage("error", "Category name is required");
      return;
    }
    try {
      setActionLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error("Unauthorized access. Please login again.");
      const result = await dispatch(
        createCategoryThunk({ token, payload: newCategory })
      );
      if (createCategoryThunk.fulfilled.match(result)) {
        showMessage("success", "Category created successfully");
        setNewCategory({ name: "" });
        setShowModal(false);
        await fetchCategoriesRedux();
      } else {
        showMessage(
          "error",
          (result.payload as string) || "Failed to create category"
        );
      }
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to create category"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Update category
  const updateCategory = async () => {
    if (!editingCategory || !newCategory.name.trim()) {
      showMessage("error", "Category name is required");
      return;
    }
    try {
      setActionLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error("Unauthorized access. Please login again.");
      const result = await dispatch(
        updateCategoryThunk({
          token,
          id: editingCategory.id,
          payload: newCategory,
        })
      );
      if (updateCategoryThunk.fulfilled.match(result)) {
        await fetchCategoriesRedux();
        showMessage("success", "Category updated successfully");
        setNewCategory({ name: "" });
        setEditingCategory(null);
        setShowModal(false);
      } else {
        showMessage(
          "error",
          (result.payload as string) || "Failed to update category"
        );
      }
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to update category"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    try {
      setActionLoading(true);
      const token = getAuthToken();
      if (!token) throw new Error("Unauthorized access. Please login again.");
      const result = await dispatch(deleteCategoryThunk({ token, id }));
      if (deleteCategoryThunk.fulfilled.match(result)) {
        await fetchCategoriesRedux();
        showMessage("success", "Category deleted successfully");
      } else {
        showMessage(
          "error",
          (result.payload as string) || "Failed to delete category"
        );
      }
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to delete category"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory();
    } else {
      createCategory();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Open modal for editing
  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name });
    setShowModal(true);
  };

  // Open modal for creating
  const openCreateModal = () => {
    setEditingCategory(null);
    setNewCategory({ name: "" });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setNewCategory({ name: "" });
  };

  // Filter categories based on search term
  const filteredCategories = (categoryState.categories || []).filter(
    (category) =>
      (category as Category).name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Load categories on component mount
  useEffect(() => {
    fetchCategoriesRedux();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {/* Message Toast */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          )}
          <span
            className={`text-sm font-medium ${
              message.type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message.text}
          </span>
        </div>
      )}

      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
          showModal ? "blur-sm" : ""
        }`}
      >
        {/* Modern Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Category Management
          </h1>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
              />
            </div>
            {/* Add Button */}
            <button
              onClick={openCreateModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Content */}
        {categoryState.loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        ) : (
          <>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm
                    ? "No categories found matching your search."
                    : "No categories available."}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => openEditModal(category)}
                              className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCategory(category.id)}
                              className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
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
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md z-50 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {actionLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
