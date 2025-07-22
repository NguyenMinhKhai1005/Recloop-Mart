import React, { useEffect, useState } from "react";
import { Eye, Edit, Lock, Unlock, Save, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UserResponse } from "../../service/userService";
import { useAuth } from "../AuthProvider";
import {
  fetchUsers,
  fetchUserById,
  updateUser as updateUserAction,
  toggleUserLock,
} from "../../redux/slices/userSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { token, user: currentUser, updateUser } = useAuth();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ fullName: string; role: string }>({
    fullName: "",
    role: "",
  });
  const [detailUser, setDetailUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token) as any);
    }
  }, [token, dispatch]);

  const handleViewUser = (user: UserResponse) => {
    if (token) {
      dispatch(fetchUserById({ token, id: user.id }) as any).then(
        (res: any) => {
          if (res.payload) setDetailUser(res.payload);
        }
      );
    }
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user.id);
    setEditForm({
      fullName: user.fullName,
      role: user.role,
    });
  };

  const handleSaveEdit = (userId: number) => {
    if (token) {
      dispatch(
        updateUserAction({ token, id: userId, payload: editForm }) as any
      ).then((result: any) => {
        // If updating current user's role, update AuthProvider
        if (currentUser && currentUser.id === userId && result.payload) {
          updateUser({
            ...currentUser,
            fullName: result.payload.fullName,
            role: result.payload.role,
          });
        }

        setEditingUser(null);
        setEditForm({ fullName: "", role: "" });
        dispatch(fetchUsers(token) as any);
      });
    }
  };

  const handleToggleLock = async (userId: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (token) {
      await dispatch(toggleUserLock({ token, id: userId }) as any);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ fullName: "", role: "" });
  };

  // Đặt ngoài return để tránh lỗi parsing
  function closeDetailModal() {
    setDetailUser(null);
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Modern Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user: UserResponse) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editingUser === user.id ? (
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, fullName: e.target.value })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      user.fullName
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editingUser === user.id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.isLocked === true
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isLocked === true ? "Locked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      {editingUser === user.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            className="p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                            title="Save changes"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewUser(user)}
                            className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => handleToggleLock(user.id, e)}
                            className={`p-2 rounded-full transition-colors ${
                              user.isLocked === true
                                ? "text-red-600 hover:bg-red-100"
                                : "text-green-600 hover:bg-green-100"
                            }`}
                            title={
                              user.isLocked === true
                                ? "Unlock"
                                : "Lock"
                            }
                            type="button"
                          >
                            {user.isLocked === true ? (
                              <Lock size={16} />
                            ) : (
                              <Unlock size={16} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No users to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
            onClick={closeDetailModal}
          ></div>
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-96 max-w-md z-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">User Details</h3>
              <button
                onClick={closeDetailModal}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <p className="mt-1 text-sm text-gray-900">{detailUser?.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {detailUser?.fullName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {detailUser?.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-1 text-sm text-gray-900">{detailUser?.role}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {detailUser?.isLocked ? "Locked" : "Active"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
