import { Tag } from "lucide-react";

const CategoryCard = ({ category }) => {
  return (
    <div className="card card-interactive overflow-hidden group cursor-pointer">
      {/* Image */}
      {category.image ? (
        <div className="relative overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <h3 className="absolute bottom-3 left-3 text-white font-semibold text-lg">
            {category.name}
          </h3>
        </div>
      ) : (
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-(--color-primary-100) flex items-center justify-center">
            <Tag className="w-5 h-5 text-(--color-primary-600)" />
          </div>
          <h3 className="text-base font-semibold text-theme-primary">
            {category.name}
          </h3>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
