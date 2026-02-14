const Loader = ({ size = "default", text = "" }) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    default: "w-12 h-12 border-4",
    large: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div
        className={`${sizeClasses[size]} border-(--color-primary-600) border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p className="text-theme-secondary text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

export default Loader;
