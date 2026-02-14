import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProfile, clearError } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, ShieldCheck, Package, ChevronRight, ShoppingCart, Zap, Info } from "lucide-react";
import Loader from "../../components/ui/Loader";
import Modal from "../../components/ui/Modal";
import BackButton from "../../components/ui/BackButton";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!user) {
      dispatch(getProfile());
    }
    if (error) {
      setShowErrorModal(true);
    }
  }, [user, dispatch, navigate, isAuthenticated, error]);

  const handleCloseModal = () => {
    setShowErrorModal(false);
    dispatch(clearError());
  };

  if (loading) return <Loader text="Loading profile..." />;

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Page Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-(--color-primary-100) flex items-center justify-center">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-(--color-primary-600)" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-theme-primary">My Profile</h1>
      </div>

      {/* Main Profile Card */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">

          {/* Left Column: User Info + Account Information */}
          <div className="lg:col-span-2 p-4 pb-12 sm:p-6 border-b lg:border-b-0 lg:border-r border-theme-primary">

            {/* User Profile Section */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6 group cursor-default">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h2 className="text-base sm:text-lg font-semibold text-theme-primary">Profile Details</h2>
              </div>

              <div className="flex flex-row items-center gap-4 sm:gap-6">
                {/* Avatar Circle */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-(--color-primary-400) to-(--color-primary-600) flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* Name & Email */}
                <div className="text-left flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-theme-primary truncate">{user?.name}</h3>
                  <p className="text-theme-tertiary flex items-center justify-start gap-1 sm:gap-2 mt-1 text-xs sm:text-sm">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                  {user?.role === "admin" && (
                    <span className="inline-flex items-center gap-1 mt-2 badge badge-primary">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="mt-8 sm:mt-0">
              <div className="flex items-center gap-2 mb-3 sm:mb-4 group cursor-default">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
                <h2 className="text-base sm:text-lg font-semibold text-theme-primary">User Detail</h2>
              </div>

              <div className="space-y-3 bg-theme-tertiary rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-theme-primary">
                  <span className="text-theme-tertiary font-medium text-sm sm:text-base">Full Name</span>
                  <span className="text-theme-primary text-sm sm:text-base">{user?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-theme-primary">
                  <span className="text-theme-tertiary font-medium text-sm sm:text-base">Email Address</span>
                  <span className="text-theme-primary text-sm sm:text-base">{user?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3">
                  <span className="text-theme-tertiary font-medium text-sm sm:text-base">Account Type</span>
                  <span className="text-theme-primary capitalize text-sm sm:text-base">{user?.role || "User"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions */}
          <div className="lg:col-span-1 p-4 sm:p-6 pt-4 lg:pt-4 sm:pt-6 lg:mt-0 bg-theme-secondary border-t lg:border-t-0 border-theme-primary shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 group cursor-default">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600) group-hover:scale-110 group-hover:text-(--color-accent-500) transition-all duration-200" />
              <h2 className="text-base sm:text-lg font-semibold text-theme-primary">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              {/* My Orders */}
              <Link
                to="/profile/orders"
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-theme-card hover:bg-theme-tertiary transition-colors group border border-theme-primary"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-(--color-primary-100) flex items-center justify-center">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-primary-600)" />
                  </div>
                  <div>
                    <p className="font-medium text-theme-primary text-sm sm:text-base">My Orders</p>
                    <p className="text-xs sm:text-sm text-theme-tertiary">View order history</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-theme-muted group-hover:text-theme-primary transition-colors" />
              </Link>

              {/* Shopping Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg bg-theme-card hover:bg-theme-tertiary transition-colors group border border-theme-primary"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-(--color-accent-100) flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-(--color-accent-600)" />
                  </div>
                  <div>
                    <p className="font-medium text-theme-primary text-sm sm:text-base">Shopping Cart</p>
                    <p className="text-xs sm:text-sm text-theme-tertiary">View cart items</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-theme-muted group-hover:text-theme-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {error && (
        <Modal
          isOpen={showErrorModal}
          onClose={handleCloseModal}
          title="Error"
        >
          <p className="text-theme-secondary">{error}</p>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
