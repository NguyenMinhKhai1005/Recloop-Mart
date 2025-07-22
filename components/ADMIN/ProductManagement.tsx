import React, { useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProducts,
  fetchProductById,
  approveProduct,
  rejectProduct,
} from "../../redux/slices/productSlice";
import type { Product } from "../../service/productService";
import type { RootState } from "../../redux/store";

const AdminProductManagement = () => {
  const dispatch = useAppDispatch();
  const { products, selectedProduct, loading } = useAppSelector(
    (state: RootState) => state.product
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [filter, setFilter] = useState("all");

  // Get token
  const getAuthToken = () =>
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  useEffect(() => {
    const token = getAuthToken();
    if (token) dispatch(fetchProducts(token));
  }, [dispatch]);

  const handleViewDetails = (product: Product) => {
    setShowDetailModal(true);
    // fetch detail if needed
    const token = getAuthToken();
    if (token) dispatch(fetchProductById({ token, id: product.id }));
  };

  const handleApprove = (id: number) => {
    if (window.confirm("Are you sure you want to approve this product?")) {
      const token = getAuthToken();
      if (token) dispatch(approveProduct({ token, id }));
    }
  };

  const handleReject = (product: Product) => {
    setShowRejectModal(true);
    const token = getAuthToken();
    if (token) dispatch(fetchProductById({ token, id: product.id }));
  };


  const filteredProducts = products.filter((product: Product) => {
    switch (filter) {
      case "pending":
        return !product.isApproved && !product.rejectedReason;
      case "approved":
        return product.isApproved;
      case "rejected":
        return product.rejectedReason;
      default:
        return true;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (product: Product) => {
    if (product.rejectedReason) {
      return (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          Rejected
        </span>
      );
    } else if (product.isApproved) {
      return (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="relative">
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
          showDetailModal || showRejectModal ? "blur-sm" : ""
        }`}
      >
        {/* Modern Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Product Management - Admin</h1>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => {
                const token = getAuthToken();
                if (token) dispatch(fetchProducts(token));
              }}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { key: "all", label: "All Products" },
            { key: "pending", label: "Pending" },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {label} (
              {
                products.filter((p: Product) => {
                  switch (key) {
                    case "pending":
                      return !p.isApproved && !p.rejectedReason;
                    case "approved":
                      return p.isApproved;
                    case "rejected":
                      return p.rejectedReason;
                    default:
                      return true;
                  }
                }).length
              }
              )
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product: Product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.descriptions}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.categoryName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        product.condition === "new"
                          ? "bg-green-100 text-green-700"
                          : product.condition === "used"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {product.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.locations}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleViewDetails(product)}
                        className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>

                      {!product.isApproved && !product.rejectedReason && (
                        <>
                          <button
                            onClick={() => handleApprove(product.id)}
                            className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                            title="Approve"
                            disabled={loading}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(product)}
                            className="p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                            title="Reject"
                            disabled={loading}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No products found for the selected filter.
            </p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl z-50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Product Details
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProduct.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(selectedProduct)}</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedProduct.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedProduct.descriptions}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProduct.categoryName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    ${selectedProduct.price}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProduct.condition}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedProduct.locations}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedProduct.createdAt)}
                </p>
              </div>

              {selectedProduct.approvedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approved At
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedProduct.approvedAt)}
                  </p>
                </div>
              )}

              {selectedProduct.rejectedReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rejected Reason
                  </label>
                  <p className="mt-1 text-sm text-red-600">
                    {selectedProduct.rejectedReason}
                  </p>
                </div>
              )}
            </div>

            {!selectedProduct.isApproved && !selectedProduct.rejectedReason && (
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleApprove(selectedProduct.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                  disabled={loading}
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleReject(selectedProduct);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  disabled={loading}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Reject Product: {selectedProduct.title}
            </h3>
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={4}
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (rejectReason.trim() && selectedProduct) {
                      const token = getAuthToken();
                      if (token)
                        dispatch(
                          rejectProduct({
                            token,
                            id: selectedProduct.id,
                            payload: { rejectedReason: rejectReason },
                          })
                        );
                      setShowRejectModal(false);
                      setRejectReason("");
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                  disabled={loading || !rejectReason.trim()}
                >
                  {loading ? "Rejecting..." : "Reject Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
