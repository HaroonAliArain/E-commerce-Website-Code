import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    dispatch(register({ name, email, password }));
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      toast.success(`Welcome, ${user.name}! Registration successful!`);
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const inputFields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe", icon: User },
    { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com", icon: Mail },
    { name: "password", label: "Password", type: "password", placeholder: "••••••••", icon: Lock },
    { name: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••", icon: Lock },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-(--color-primary-400) to-(--color-primary-600) flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">Create Account</h1>
            <p className="text-theme-tertiary mt-1 text-sm sm:text-base">Join us and start shopping</p>
          </div>

          {/* Error Messages */}
          {(error || passwordError) && (
            <div className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-lg bg-(--color-error-50) border border-(--color-error-200)">
              <p className="text-(--color-error-600) text-xs sm:text-sm text-center">
                {passwordError || error}
                {error && (
                  <button
                    onClick={() => dispatch(clearError())}
                    className="ml-2 underline"
                  >
                    Dismiss
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {inputFields.map((field) => (
              <div key={field.name}>
                <label className="block text-xs sm:text-sm font-medium text-theme-secondary mb-1.5">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 rounded-lg bg-theme-primary border 
                      text-theme-primary placeholder:text-theme-muted text-sm sm:text-base
                      focus:border-(--color-primary-500) focus:ring-2 focus:ring-(--color-primary-500)/20
                      transition-all duration-200
                      ${field.name === "confirmPassword" && passwordError
                        ? "border-(--color-error-500)"
                        : "border-theme-primary"}`}
                  />
                  <field.icon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-theme-muted" />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base mt-4 sm:mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 sm:mt-6 text-center text-theme-tertiary text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-(--color-primary-600) hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
