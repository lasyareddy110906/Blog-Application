import { useEffect, useState } from "react";
import axios from "axios";
import { loadingClass, errorClass } from "../styles/common";
import toast from "react-hot-toast";

function BlockOrActivate() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/admin-api/users", { withCredentials: true });
      if (res.status === 200) {
        setUsers(res.data.payload);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId) => {
    try {
      const res = await axios.put("http://localhost:4000/admin-api/users", { userId }, { withCredentials: true });
      if (res.status === 200) {
        toast.success(res.data.message);
        // Refresh local state to reflect change immediately
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle status");
    }
  };

  if (loading && users.length === 0) return <p className={loadingClass}>Loading users...</p>;
  if (error) return <p className={errorClass}>{error}</p>;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">Manage Users</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-[#e8e8ed] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f5f5f7] border-b border-[#e8e8ed]">
              <th className="py-4 px-6 font-semibold text-[#1d1d1f]">User Name</th>
              <th className="py-4 px-6 font-semibold text-[#1d1d1f]">Email</th>
              <th className="py-4 px-6 font-semibold text-[#1d1d1f]">Role</th>
              <th className="py-4 px-6 font-semibold text-[#1d1d1f]">Status</th>
              <th className="py-4 px-6 font-semibold text-[#1d1d1f] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-[#e8e8ed] last:border-0 hover:bg-[#fafafa] transition">
                <td className="py-4 px-6 font-medium text-[#1d1d1f]">
                  {user.firstName} {user.lastName || ""}
                </td>
                <td className="py-4 px-6 text-[#6e6e73]">{user.email}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : user.role === 'AUTHOR' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {user.isUserActive ? (
                    <span className="text-green-600 font-medium tracking-wide">Active</span>
                  ) : (
                    <span className="text-red-500 font-medium tracking-wide">Blocked</span>
                  )}
                </td>
                <td className="py-4 px-6 text-right">
                  {user.role !== "ADMIN" && (
                    <button
                      onClick={() => toggleUserStatus(user._id)}
                      className={`text-sm px-4 py-2 rounded-full font-medium transition ${
                        user.isUserActive
                          ? "p-2 bg-red-50 text-red-600 hover:bg-red-100"
                          : "px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {user.isUserActive ? "Block User" : "Activate User"}
                    </button>
                  )}
                  {user.role === "ADMIN" && <span className="text-sm text-gray-400">N/A</span>}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-[#6e6e73]">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BlockOrActivate;
