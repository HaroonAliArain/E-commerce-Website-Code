import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-md bg-theme-card border border-theme-primary rounded-xl shadow-theme-lg animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-theme-primary">
          <h2 className="text-lg font-semibold text-theme-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-theme-secondary hover:bg-theme-tertiary hover:text-theme-primary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 pt-0">
          <button
            onClick={onClose}
            className="w-full btn-primary py-2.5 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
