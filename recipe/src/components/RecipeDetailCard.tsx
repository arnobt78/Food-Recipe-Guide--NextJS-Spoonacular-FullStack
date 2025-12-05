/**
 * Recipe Detail Card Component
 * 
 * Displays recipe details in a card format with:
 * - Image on the left
 * - Badge tabs for different sections
 * - Recipe summary/content
 * - Replaces the modal approach
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useRecipeSummary } from "../hooks/useRecipes";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { X, ChefHat, UtensilsCrossed, Heart } from "lucide-react";
import { Recipe } from "../types";
import { capitalizeWords, addTargetBlankToLinks } from "../utils/stringUtils";
import { Skeleton } from "./ui/skeleton";

interface Props {
  recipe: Recipe;
  onClose: () => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
}

/**
 * Recipe Detail Card Component (Memoized for performance)
 * 
 * Displays recipe details in a card format with:
 * - Image on the left
 * - Badge tabs for different sections
 * - Recipe summary/content
 * - Replaces the modal approach
 */
const RecipeDetailCard = memo(({ recipe, onClose, isFavourite, onToggleFavourite }: Props) => {
  const { data: recipeSummary, isLoading } = useRecipeSummary(recipe.id.toString(), true);

  // Memoized computed values
  const capitalizedTitle = useMemo(
    () => capitalizeWords(recipeSummary?.title || recipe.title),
    [recipeSummary?.title, recipe.title]
  );

  const summaryWithTargetBlank = useMemo(
    () => addTargetBlankToLinks(recipeSummary?.summary),
    [recipeSummary?.summary]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-full"
    >
      <Card className="glow-card border-purple-500/30 overflow-hidden">
        {/* Header with Close Button */}
        <CardHeader className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/30">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl md:text-3xl font-bold gradient-text flex-1 pr-4">
              {capitalizedTitle}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavourite}
                className="hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              >
                <Heart
                  className={`h-5 w-5 ${isFavourite ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-red-500/20 text-gray-400 hover:text-red-400"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Recipe Image */}
            <div className="lg:w-1/3 relative overflow-hidden">
              <div className="aspect-square lg:aspect-auto lg:h-full relative">
                <img
                  src={recipe.image || "/hero-image.webp"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Decorative SVG Icons Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <img
                    src="/chef.svg"
                    alt="Chef"
                    className="w-8 h-8 opacity-60 drop-shadow-lg"
                  />
                  <img
                    src="/cooking.svg"
                    alt="Cooking"
                    className="w-8 h-8 opacity-60 drop-shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Recipe Content */}
            <div className="lg:w-2/3 p-6 custom-scrollbar max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <div className="space-y-6">
                  {/* Tabs Skeleton */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  {/* Content Skeleton */}
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ) : recipeSummary ? (
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800/50">
                    <TabsTrigger value="summary" className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="info" className="flex items-center gap-2">
                      <ChefHat className="h-4 w-4" />
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary" className="space-y-4">
                    <div className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: summaryWithTargetBlank }} />
                    </div>
                  </TabsContent>

                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Badge variant="outline" className="glow-badge justify-center py-2">
                        <img src="/food.svg" alt="Food" className="w-4 h-4 mr-2" />
                        Recipe ID: {recipe.id}
                      </Badge>
                      <Badge variant="outline" className="glow-badge justify-center py-2">
                        <img src="/diet.svg" alt="Diet" className="w-4 h-4 mr-2" />
                        {recipe.imageType || "Image"}
                      </Badge>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-purple-300 mb-4">Recipe Information</h3>
                      <p className="text-gray-300 leading-relaxed">
                        This recipe is sourced from the Spoonacular API. Click any links in the summary
                        to view the full recipe instructions and ingredients list on the original source.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                        <img src="/hamburger.svg" alt="Recipe" className="w-6 h-6" />
                        <div>
                          <p className="text-sm text-gray-400">Recipe Title</p>
                          <p className="text-white font-medium">{recipe.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                        <img src="/barbecue.svg" alt="Cuisine" className="w-6 h-6" />
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <Badge className={isFavourite ? "bg-red-500/20 text-red-300" : "bg-purple-500/20 text-purple-300"}>
                            {isFavourite ? "In Favourites" : "Not in Favourites"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <p>Recipe details not available.</p>
                </div>
              )}

              {/* Footer Info */}
              <div className="mt-6 pt-6 border-t border-purple-500/20 text-center text-gray-400 text-sm flex items-center justify-center gap-2">
                <span>ℹ️</span>
                <span>Click links to view full recipes. Scroll for more info.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

RecipeDetailCard.displayName = "RecipeDetailCard";

export default RecipeDetailCard;

