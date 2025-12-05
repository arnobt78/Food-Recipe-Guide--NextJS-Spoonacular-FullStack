/**
 * Recipe Context - Centralized state management for recipe-related data
 * 
 * Provides:
 * - Selected recipe state
 * - Search term state
 * - Tab state
 * - Query params synchronization
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { Recipe, TabType } from "../types";

interface RecipeContextType {
  selectedRecipe: Recipe | undefined;
  setSelectedRecipe: (recipe: Recipe | undefined) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

/**
 * Recipe Provider Component
 * Manages recipe state and syncs with URL query params
 */
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<TabType>("search");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Memoized setters to prevent unnecessary re-renders
  const handleSetSelectedRecipe = useCallback((recipe: Recipe | undefined) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSetSelectedTab = useCallback((tab: TabType) => {
    setSelectedTab(tab);
  }, []);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Sync selected recipe with URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("recipeId");

    if (recipeId && !selectedRecipe) {
      // Recipe ID in URL but no selected recipe - could load from cache if needed
      // For now, we'll handle this in the component that uses the context
    } else if (!recipeId && selectedRecipe) {
      // Selected recipe but no ID in URL - add it
      params.set("recipeId", selectedRecipe.id.toString());
      window.history.replaceState({}, "", `?${params.toString()}`);
    } else if (recipeId && selectedRecipe && recipeId !== selectedRecipe.id.toString()) {
      // URL has different recipe ID - clear selection or update
      setSelectedRecipe(undefined);
    }
  }, [selectedRecipe]);

  // Sync search term with URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSearchTerm = params.get("search");

    if (urlSearchTerm && urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    } else if (searchTerm && !urlSearchTerm) {
      params.set("search", searchTerm);
      window.history.replaceState({}, "", `?${params.toString()}`);
    }
  }, [searchTerm]);

  // Sync tab with URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get("tab") as TabType | null;

    if (urlTab && (urlTab === "search" || urlTab === "favourites") && urlTab !== selectedTab) {
      setSelectedTab(urlTab);
    } else if (selectedTab && urlTab !== selectedTab) {
      params.set("tab", selectedTab);
      window.history.replaceState({}, "", `?${params.toString()}`);
    }
  }, [selectedTab]);

  // Initialize from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlSearchTerm = params.get("search");
    const urlTab = params.get("tab") as TabType | null;

    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }

    if (urlTab && (urlTab === "search" || urlTab === "favourites")) {
      setSelectedTab(urlTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      selectedRecipe,
      setSelectedRecipe: handleSetSelectedRecipe,
      searchTerm,
      setSearchTerm: handleSetSearchTerm,
      selectedTab,
      setSelectedTab: handleSetSelectedTab,
      currentPage,
      setCurrentPage: handleSetCurrentPage,
    }),
    [
      selectedRecipe,
      handleSetSelectedRecipe,
      searchTerm,
      handleSetSearchTerm,
      selectedTab,
      handleSetSelectedTab,
      currentPage,
      handleSetCurrentPage,
    ]
  );

  return (
    <RecipeContext.Provider value={contextValue}>{children}</RecipeContext.Provider>
  );
}

/**
 * Hook to use Recipe Context
 */
export function useRecipeContext() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipeContext must be used within a RecipeProvider");
  }
  return context;
}

