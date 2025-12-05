/**
 * Reusable Error Message Component
 * 
 * Features:
 * - Consistent error styling
 * - Animated appearance
 * - Reusable across the app
 */

import { motion } from "framer-motion";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage = ({ message, className = "" }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`text-red-400 font-medium text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30 ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </motion.div>
  );
};

export default ErrorMessage;

