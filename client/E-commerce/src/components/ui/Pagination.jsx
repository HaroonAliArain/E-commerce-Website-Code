import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const buttonBase = "flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg font-medium text-sm transition-all duration-200";

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBase} border border-theme-primary
          ${currentPage === 1
            ? "opacity-50 cursor-not-allowed bg-theme-tertiary text-theme-muted"
            : "bg-theme-card text-theme-primary hover:bg-theme-tertiary"}`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-theme-muted">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${buttonBase} ${page === currentPage
                ? "btn-primary"
                : "border border-theme-primary bg-theme-card text-theme-primary hover:bg-theme-tertiary"
              }`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonBase} border border-theme-primary
          ${currentPage === totalPages
            ? "opacity-50 cursor-not-allowed bg-theme-tertiary text-theme-muted"
            : "bg-theme-card text-theme-primary hover:bg-theme-tertiary"}`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
