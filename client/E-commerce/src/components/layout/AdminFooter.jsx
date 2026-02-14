import { Store } from "lucide-react";
import { Link } from "react-router-dom";

const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    const linkStyle = "text-base text-theme-tertiary transition-colors duration-200 cursor-pointer";

    return (
        <footer className="w-full bg-(--bg-footer) border-t border-theme-primary py-6 px-6">
            <div className="flex sm:hidden flex-col items-center justify-center gap-3 text-center">
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-primary-500) to-(--color-primary-700) flex items-center justify-center shadow-md">
                    <Store className="w-5 h-5 text-white" />
                </div>

                <span className="text-base text-theme-tertiary">© {currentYear} E-Shop Admin. All rights reserved.</span>

                {/* Privacy Policy Link */}
                <Link 
                    to="/privacy" 
                    className={linkStyle} 
                    style={{ color: 'inherit' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'} 
                    onMouseLeave={(e) => e.currentTarget.style.color = ''} 
                    onTouchStart={(e) => e.currentTarget.style.color = '#3b82f6'} 
                    onTouchEnd={(e) => e.currentTarget.style.color = ''}
                >
                    Privacy Policy
                </Link>
            </div>

            {/* Medium/Large Screen Layout - Horizontal */}
            <div className="hidden sm:flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-theme-tertiary text-base">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--color-primary-500) to-(--color-primary-700) flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4 text-white" />
                    </div>
                    <span>© {currentYear} E-Shop Admin. All rights reserved.</span>
                </div>

                {/* Privacy Policy Link */}
                <Link
                    to="/privacy"
                    className={linkStyle}
                    style={{ color: 'inherit' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                    Privacy Policy
                </Link>
            </div>
        </footer>
    );
};

export default AdminFooter;