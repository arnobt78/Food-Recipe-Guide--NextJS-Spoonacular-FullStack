/**
 * Main App Component
 * 
 * Features:
 * - React Query for data fetching with infinite cache
 * - Query params synchronization
 * - Reusable components (ShadCN UI)
 * - Centralized context for state management
 * - Card-based recipe detail view (replaces modal)
 * - SVG images integration
 * - Optimized with useMemo/useCallback
 * - No code duplication
 */

import { FormEvent, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecipeProvider, useRecipeContext } from "./context/RecipeContext";
import RecipeDetailCard from "./components/RecipeDetailCard";
import SearchInput from "./components/SearchInput";
import TabNavigation from "./components/TabNavigation";
import RecipeGrid from "./components/RecipeGrid";
import ErrorMessage from "./components/ErrorMessage";
import EmptyState from "./components/EmptyState";
import ViewMoreButton from "./components/ViewMoreButton";
import HeroHeader from "./components/HeroHeader";
import SkeletonRecipeGrid from "./components/SkeletonRecipeGrid";
import SkeletonSearchInput from "./components/SkeletonSearchInput";
import SkeletonHeroHeader from "./components/SkeletonHeroHeader";
import {
  useSearchRecipes,
  useFavouriteRecipes,
  useAddFavouriteRecipe,
  useRemoveFavouriteRecipe,
} from "./hooks/useRecipes";
import { useIsFavourite } from "./hooks/useIsFavourite";
import { Recipe, SearchRecipesResponse } from "./types";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Main App Content (wrapped in RecipeProvider)
 */
const AppContent = () => {
  const {
    selectedRecipe,
    setSelectedRecipe,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    currentPage,
    setCurrentPage,
  } = useRecipeContext();

  // React Query hooks with infinite cache strategy
  const {
    data: searchResponse,
    isLoading: isSearching,
    error: searchError,
  } = useSearchRecipes(searchTerm, currentPage, !!searchTerm && selectedTab === "search");

  const {
    data: favouriteRecipes = [],
    isLoading: isLoadingFavourites,
    error: favouritesError,
  } = useFavouriteRecipes();
  const addFavouriteMutation = useAddFavouriteRecipe();
  const removeFavouriteMutation = useRemoveFavouriteRecipe();

  // Handle search errors with toast
  useEffect(() => {
    if (searchError) {
      const error = searchError as any;
      if (error?.code === 402 || error?.message?.includes("points limit")) {
        toast.error(
          "Daily API limit reached. Please try again later or upgrade your plan."
        );
      } else {
        toast.error("Failed to search recipes. Please try again.");
      }
    }
  }, [searchError]);

  // Handle favourites errors with toast
  useEffect(() => {
    if (favouritesError) {
      toast.error("Failed to load favourite recipes.");
    }
  }, [favouritesError]);

  // Memoized computed values
  const recipes = useMemo(
    () => (Array.isArray(searchResponse?.results) ? searchResponse.results : []),
    [searchResponse]
  ) as Recipe[];

  const apiError = useMemo(
    () =>
      (searchResponse as SearchRecipesResponse)?.status === "failure" ||
      (searchResponse as SearchRecipesResponse)?.code === 402
        ? (searchResponse as SearchRecipesResponse)?.message ||
          "Daily API limit reached. Please try again later."
        : "",
    [searchResponse]
  );

  const isSelectedRecipeFavourite = useIsFavourite(selectedRecipe, favouriteRecipes);

  // Memoized event handlers
  const handleSearchSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!searchTerm.trim()) return;
      setCurrentPage(1);
    },
    [searchTerm, setCurrentPage]
  );

  const handleViewMoreClick = useCallback(() => {
    setCurrentPage(currentPage + 1);
  }, [currentPage, setCurrentPage]);

  const handleRecipeClick = useCallback(
    (recipe: Recipe) => {
      setSelectedRecipe(recipe);
    },
    [setSelectedRecipe]
  );

  const handleFavouriteToggle = useCallback(
    (recipe: Recipe, isFavourite: boolean) => {
      if (isFavourite) {
        removeFavouriteMutation.mutate(recipe);
      } else {
        addFavouriteMutation.mutate(recipe);
      }
    },
    [addFavouriteMutation, removeFavouriteMutation]
  );

  const handleToggleFavourite = useCallback(() => {
    if (!selectedRecipe) return;
    handleFavouriteToggle(selectedRecipe, isSelectedRecipeFavourite);
  }, [selectedRecipe, isSelectedRecipeFavourite, handleFavouriteToggle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20 pt-5">
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        {/* Hero Header */}
        {isSearching || isLoadingFavourites ? (
          <SkeletonHeroHeader />
        ) : (
          <HeroHeader
            title="My Recipe App"
            subtitle="Discover & Save Your Favourite Recipes"
            icons={["/chef.svg", "/cooking.svg", "/food.svg"]}
          />
        )}

        {/* Tab Navigation */}
        <TabNavigation value={selectedTab} onValueChange={setSelectedTab} />

        <AnimatePresence mode="wait">
          {selectedTab === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Search Input */}
              {isSearching ? (
                <SkeletonSearchInput />
              ) : (
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onSubmit={handleSearchSubmit}
                  isLoading={isSearching}
                />
              )}

              {/* Error Message */}
              <ErrorMessage message={apiError} />

              {/* Recipe Grid */}
              {isSearching ? (
                <SkeletonRecipeGrid count={8} />
              ) : recipes.length > 0 ? (
                <RecipeGrid
                  recipes={recipes}
                  favouriteRecipes={favouriteRecipes}
                  onRecipeClick={handleRecipeClick}
                  onFavouriteToggle={handleFavouriteToggle}
                />
              ) : null}

              {/* View More Button */}
              {recipes.length > 0 && (
                <ViewMoreButton onClick={handleViewMoreClick} isLoading={isSearching} />
              )}
            </motion.div>
          )}

          {selectedTab === "favourites" && (
            <motion.div
              key="favourites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {isLoadingFavourites ? (
                <SkeletonRecipeGrid count={4} />
              ) : favouriteRecipes.length === 0 ? (
                <EmptyState message="No favourite recipes yet. Add some from the search tab!" />
              ) : (
                <RecipeGrid
                  recipes={favouriteRecipes as Recipe[]}
                  favouriteRecipes={favouriteRecipes as Recipe[]}
                  onRecipeClick={handleRecipeClick}
                  onFavouriteToggle={handleFavouriteToggle}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Detail Card (replaces modal) */}
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedRecipe(undefined)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <RecipeDetailCard
                  recipe={selectedRecipe}
                  onClose={() => setSelectedRecipe(undefined)}
                  isFavourite={isSelectedRecipeFavourite}
                  onToggleFavourite={handleToggleFavourite}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * App Component with RecipeProvider
 */
const App = () => {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
};

export default App;
