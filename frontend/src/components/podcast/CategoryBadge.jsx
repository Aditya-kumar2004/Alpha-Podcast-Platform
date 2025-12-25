import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';

const CategoryBadge = ({ category, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      )}
    >
      {category}
    </button>
  );
};

CategoryBadge.propTypes = {
  category: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func
};

CategoryBadge.defaultProps = {
  isActive: false,
  onClick: () => {}
};

export default CategoryBadge;