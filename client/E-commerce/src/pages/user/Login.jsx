import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/admin/dashboard", { replace: true });
    } else if (isAuthenticated && user) {
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-600) flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Welcome Back</h1>
            <p className="text-theme-tertiary mt-1 text-sm sm:text-base">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg bg-(--color-error-50) border border-(--color-error-200)">
              <p className="text-(--color-error-600) text-xs sm:text-sm text-center">
                {error}
                <button
                  onClick={() => dispatch(clearError())}
                  className="ml-2 underline"
                >
                  Dismiss
                </button>
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-theme-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 rounded-lg bg-theme-primary border border-theme-primary
                    text-theme-primary placeholder:text-theme-muted text-sm sm:text-base
                    focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                    transition-all duration-200"
                />
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-theme-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-theme-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 rounded-lg bg-theme-primary border border-theme-primary
                    text-theme-primary placeholder:text-theme-muted text-sm sm:text-base
                    focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                    transition-all duration-200"
                />
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-theme-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 sm:mt-6 text-center text-theme-tertiary text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-(--color-primary-600) hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
