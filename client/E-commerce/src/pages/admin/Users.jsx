import { useEffect, useState } from "react";
import { Users, ShieldCheck, Search, AlertCircle, Mail } from "lucide-react";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users/");
      setUsers(data.allUsers);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users?.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader text="Loading users..." />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
            <Users className="w-5 h-5 text-(--color-primary-600)" />
          </div>
          <h1 className="text-2xl font-bold text-theme-primary">Users</h1>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 rounded-lg bg-theme-card border border-theme-primary
            text-theme-primary placeholder:text-theme-muted
            focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
            transition-all duration-200"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
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

      {/* Users - Mobile Cards & Desktop Table */}
      {filteredUsers?.length > 0 ? (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="card p-4 hover:shadow-theme-md transition-all duration-200"
              >
                <div className="flex gap-3 items-start">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-(--color-primary-400) to-(--color-primary-700) flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    {/* Name + Role Badge Row */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-theme-primary truncate">{user.name}</p>
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-(--color-primary-100) text-(--color-primary-600) shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-(--color-primary-600) text-white shrink-0">
                          User
                        </span>
                      )}
                    </div>

                    {/* Email Row - Full Width */}
                    <p className="text-xs text-theme-tertiary mt-1.5">
                      <Mail className="w-3 h-3 inline-block align-middle mr-1.5" />
                      <span className="break-all align-middle">{user.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block">
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-theme">
                  <thead>
                    <tr>
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4 hidden md:table-cell">Email</th>
                      <th className="text-left p-4">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-theme-tertiary transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-(--color-primary-400) to-(--color-primary-600) flex items-center justify-center text-white font-medium shadow-sm">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-theme-primary">{user.name}</p>
                              <p className="text-xs text-theme-tertiary md:hidden flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-theme-secondary">{user.email}</span>
                        </td>
                        <td className="p-4">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-(--color-primary-100) text-(--color-primary-600)">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-(--color-primary-600) text-white">
                              User
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-theme-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-theme-primary mb-2">No users found</h2>
          <p className="text-theme-tertiary">
            {searchTerm ? "Try a different search term" : "Users will appear here when registered"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
