/**
 * Reusable Search Input Component
 * 
 * Features:
 * - ShadCN Input component
 * - Search icon
 * - Gradient glow styling
 * - Accessible and reusable
 */

import { memo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AiOutlineSearch } from "react-icons/ai";
import { motion } from "framer-motion";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  isLoading?: boolean;
}

/**
 * Reusable Search Input Component (Memoized for performance)
 * 
 * Features:
 * - ShadCN Input component
 * - Search icon
 * - Gradient glow styling
 * - Accessible and reusable
 */
const SearchInput = memo(({
  value,
  onChange,
  onSubmit,
  placeholder = "Type any recipe name ...",
  isLoading = false,
}: SearchInputProps) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={onSubmit}
      className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-2 border border-purple-500/30 shadow-glow"
    >
      <Input
        type="text"
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 text-2xl border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="p-3 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-colors"
        disabled={isLoading}
        aria-label="Search recipes"
      >
        <AiOutlineSearch size={40} />
      </Button>
    </motion.form>
  );
});

SearchInput.displayName = "SearchInput";

export default SearchInput;

