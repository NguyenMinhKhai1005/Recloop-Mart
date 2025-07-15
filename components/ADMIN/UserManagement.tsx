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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          User Management
        </h2>
      </div>

      {loading && (
        <div className="px-6 py-4 text-center">
          <p className="text-gray-500">Loading users...</p>
        </div>
      )}

      {error && (
        <div className="px-6 py-4 bg-red-50 border border-red-200 rounded-md mx-6">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="px-6 py-4 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users && users.length > 0 ? (
              users.map((user: UserResponse) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.isLocked === true
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.isLocked === true ? "Locked" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      {editingUser === user.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Save changes"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-800 p-1 rounded"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="View user details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                            title="Edit user"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => handleToggleLock(user.id, e)}
                            className={`p-1 rounded ${
                              user.isLocked === true
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                            title={
                              user.isLocked === true
                                ? "Unlock user"
                                : "Lock user"
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
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No users to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">User Details</h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
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
