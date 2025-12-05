/**
 * Reusable View More Button Component
 * 
 * Features:
 * - Consistent button styling
 * - Loading state handling
 * - Framer Motion animations
 * - Reusable across paginated lists
 */

import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface ViewMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

const ViewMoreButton = ({
  onClick,
  isLoading = false,
  className = "",
}: ViewMoreButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`mx-auto block mb-12 ${className}`}
    >
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="glow-button disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isLoading ? "Loading..." : "View More"}
      </Button>
    </motion.div>
  );
};

export default ViewMoreButton;

