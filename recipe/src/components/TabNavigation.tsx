/**
 * Reusable Tab Navigation Component
 * 
 * Features:
 * - ShadCN Tabs component
 * - Query params synchronization
 * - Gradient styling
 * - Accessible navigation
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ChefHat, Heart } from "lucide-react";
import { TabType } from "../types";

interface TabNavigationProps {
  value: TabType;
  onValueChange: (value: TabType) => void;
}

/**
 * Reusable Tab Navigation Component (Memoized for performance)
 * 
 * Features:
 * - ShadCN Tabs component
 * - Query params synchronization
 * - Gradient styling
 * - Accessible navigation
 */
const TabNavigation = memo(({ value, onValueChange }: TabNavigationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <Tabs value={value} onValueChange={(v) => onValueChange(v as TabType)}>
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-800/50 border border-purple-500/30">
          <TabsTrigger
            value="search"
            className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <ChefHat className="h-4 w-4" />
            Recipe Search
          </TabsTrigger>
          <TabsTrigger
            value="favourites"
            className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            <Heart className="h-4 w-4" />
            Favourites
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </motion.div>
  );
});

TabNavigation.displayName = "TabNavigation";

export default TabNavigation;

