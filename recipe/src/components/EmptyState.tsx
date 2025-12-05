/**
 * Reusable Empty State Component
 * 
 * Features:
 * - Consistent empty state UI
 * - SVG icon integration
 * - Customizable message
 * - Reusable across the app
 */

import { motion } from "framer-motion";

interface EmptyStateProps {
  message: string;
  icon?: string;
  className?: string;
}

const EmptyState = ({
  message,
  icon = "/diet.svg",
  className = "",
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center text-gray-400 text-xl py-12 ${className}`}
    >
      <img
        src={icon}
        alt="Empty state"
        className="w-16 h-16 mx-auto mb-4 opacity-50"
      />
      <p>{message}</p>
    </motion.div>
  );
};

export default EmptyState;

