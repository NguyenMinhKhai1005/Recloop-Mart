import React, { useState } from "react";

const initialCategories = [
  { id: "CAT001", name: "Clothing", description: "All clothing items" },
  { id: "CAT002", name: "Electronics", description: "Electronic devices" },
  { id: "CAT003", name: "Books", description: "Books and literature" },
];

const initialProducts = [
  {
    id: "PRD001",
    title: "Vintage Watch",
    descriptions: "A classic timepiece",
    price: 120,
    condition: "New",
    locations: "Warehouse A",
    categoryName: "Clothing",
    isActive: true,
    isApproved: true,
    approvedAt: "2025-06-01T10:00:00Z",
    rejectedReason: null,
    createdAt: "2025-05-01T09:00:00Z",
  },
  {
    id: "PRD002",
    title: "iPhone 12",
    descriptions: "Refurbished smartphone",
    price: 800,
    condition: "Used",
    locations: "Warehouse B",
    categoryName: "Electronics",
    isActive: false,
    isApproved: false,
    approvedAt: null,
    rejectedReason: "Quality check failed",
    createdAt: "2025-05-15T14:00:00Z",
  },
  {
    id: "PRD003",
    title: "Textbook",
    descriptions: "Introduction to Programming",
    price: 25,
    condition: "New",
    locations: "Warehouse C",
    categoryName: "Books",
    isActive: true,
    isApproved: true,
    approvedAt: "2025-06-10T12:00:00Z",
    rejectedReason: null,
    createdAt: "2025-04-20T08:00:00Z",
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    descriptions: "",
    price: "",
    condition: "New",
    locations: "",
    categoryName: "",
    isActive: true,
    isApproved: false,
    approvedAt: null,
    rejectedReason: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    if (target instanceof HTMLInputElement) {
      const checked = target.checked;
      setNewProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = `PRD${String(products.length + 1).padStart(3, "0")}`;
    const productToAdd = {
      ...newProduct,
      id: newId,
      price: parseFloat(newProduct.price),
      isActive: newProduct.isActive,
      isApproved: newProduct.isApproved,
      approvedAt: newProduct.isApproved ? new Date().toISOString() : "",
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, productToAdd]);
    setNewProduct({
      title: "",
      descriptions: "",
      price: "",
      condition: "New",
      locations: "",
      categoryName: "",
      isActive: true,
      isApproved: false,
      approvedAt: null,
      rejectedReason: null,
    });
    setShowModal(false);
  };

  return (
    <div className="relative">
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
          showModal ? "blur-sm" : ""
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Product Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rejected Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.categoryName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.condition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.locations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isApproved
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isApproved ? "Approved" : "Not Approved"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.rejectedReason || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              Add New Product
            </h3>
            <form onSubmit={handleAddProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descriptions
                  </label>
                  <textarea
                    name="descriptions"
                    value={newProduct.descriptions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="categoryName"
                    value={newProduct.categoryName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {initialCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={newProduct.condition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Locations
                  </label>
                  <input
                    type="text"
                    name="locations"
                    value={newProduct.locations}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Active Status
                  </label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={newProduct.isActive}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Is Active</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approved Status
                  </label>
                  <input
                    type="checkbox"
                    name="isApproved"
                    checked={newProduct.isApproved}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Is Approved
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
