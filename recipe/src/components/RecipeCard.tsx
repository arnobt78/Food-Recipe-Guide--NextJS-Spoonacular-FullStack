/**
 * Recipe Card Component
 * 
 * Reusable card component for displaying recipe information
 * Features:
 * - ShadCN Card component
 * - Gradient glow effects
 * - Favourite button
 * - Hover animations
 * - SVG icon integration
 */

import { memo } from "react";
import { Recipe } from "../types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface Props {
  recipe: Recipe;
  isFavourite: boolean;
  onClick: () => void;
  onFavouriteButtonClick: (recipe: Recipe) => void;
}

/**
 * Recipe Card Component (Memoized for performance)
 * 
 * Reusable card component for displaying recipe information
 * Features:
 * - ShadCN Card component
 * - Gradient glow effects
 * - Favourite button
 * - Hover animations
 * - SVG icon integration
 */
const RecipeCard = memo(({
  recipe,
  onClick,
  onFavouriteButtonClick,
  isFavourite,
}: Props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="glow-card group h-full flex flex-col">
        {/* Recipe Image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={recipe.image || "/hero-image.webp"}
            alt={recipe.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Decorative SVG Icon Overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <img
              src="/hamburger.svg"
              alt="Recipe"
              className="w-6 h-6 drop-shadow-lg"
            />
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Recipe Title and Favourite Button */}
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onFavouriteButtonClick(recipe);
              }}
              className="flex-shrink-0 p-2 rounded-full hover:bg-purple-500/20 transition-colors h-auto"
              aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
            >
              {isFavourite ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <AiFillHeart size={25} className="text-red-500 drop-shadow-glow" />
                </motion.div>
              ) : (
                <AiOutlineHeart size={25} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
              )}
            </Button>
            <h3 className="text-lg font-semibold text-white flex-1 line-clamp-2 group-hover:text-purple-200 transition-colors">
              {recipe.title}
            </h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

RecipeCard.displayName = "RecipeCard";

export default RecipeCard;
