import { Store, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-(--bg-footer) border-t border-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 text-xl font-bold text-(--color-primary-600)">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-primary-500) to-(--color-primary-700) flex items-center justify-center shadow-md">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span>E-Shop</span>
            </Link>
            <p className="text-theme-secondary text-sm leading-relaxed">
              Your one-stop destination for quality products. We bring you the best selection at competitive prices.
            </p>

            {/* Social Icons with working hover colors */}
            <div className="flex items-center gap-3">
              {/* Facebook - Uses inline style for reliable hover */}
              <a
                href="#"
                className="social-icon-fb p-2.5 rounded-lg bg-theme-tertiary transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg"
              >
                <FaFacebookF className="w-5 h-5 text-theme-secondary" />
              </a>

              {/* Twitter */}
              <a
                href="#"
                className="social-icon-tw p-2.5 rounded-lg bg-theme-tertiary transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg"
              >
                <FaTwitter className="w-5 h-5 text-theme-secondary" />
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="social-icon-ig p-2.5 rounded-lg bg-theme-tertiary transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg"
              >
                <FaInstagram className="w-5 h-5 text-theme-secondary" />
              </a>
            </div>

            {/* CSS for social icon hovers and footer links */}
            <style>{`
              .social-icon-fb:hover {
                background-color: #1877F2 !important;
              }
              .social-icon-fb:hover svg {
                color: white !important;
              }
              .social-icon-tw:hover {
                background-color: #1DA1F2 !important;
              }
              .social-icon-tw:hover svg {
                color: white !important;
              }
              .social-icon-ig:hover {
                background: linear-gradient(135deg, #833AB4, #FD1D1D, #F77737) !important;
              }
              .social-icon-ig:hover svg {
                color: white !important;
              }
              .footer-link:hover {
                color: #4f46e5 !important;
              }
            `}</style>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link text-theme-secondary text-sm cursor-pointer transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-theme-primary mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-theme-secondary text-sm group cursor-pointer">
                <MapPin className="w-4 h-4 text-(--color-primary-600) group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-(--color-primary-600) transition-colors">123 E-commerce St, Digital City</span>
              </li>
              <li className="flex items-center gap-3 text-theme-secondary text-sm group cursor-pointer">
                <Phone className="w-4 h-4 text-(--color-primary-600) group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-(--color-primary-600) transition-colors">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-theme-secondary text-sm group cursor-pointer">
                <Mail className="w-4 h-4 text-(--color-primary-600) group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-(--color-primary-600) transition-colors">support@eshop.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t-2 border-(--color-primary-300)">
          <p className="text-center text-theme-tertiary text-sm">
            © {currentYear} E-Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
