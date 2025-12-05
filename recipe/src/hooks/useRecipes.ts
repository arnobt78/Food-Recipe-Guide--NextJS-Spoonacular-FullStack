/**
 * React Query hooks for recipe-related API calls
 * 
 * Caching Strategy:
 * - staleTime: Infinity = Data never becomes stale automatically
 * - refetchOnMount: true = Refetch ONLY when data is stale (invalidated)
 * - Result: Cache forever until manually invalidated, then refetch once
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api";
import { Recipe, SearchRecipesResponse, RecipeSummary } from "../types";
import { toast } from "sonner";
import { invalidateFavouritesQueries } from "../utils/queryInvalidation";

/**
 * Hook to search recipes
 * 
 * @param searchTerm - Search query string
 * @param page - Page number for pagination
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query result with data, isLoading, error, etc.
 */
export function useSearchRecipes(
  searchTerm: string,
  page: number = 1,
  enabled: boolean = true
) {
  return useQuery<SearchRecipesResponse, Error>({
    queryKey: ["recipes", "search", searchTerm, page],
    queryFn: () => api.searchRecipes(searchTerm, page),
    enabled: enabled && !!searchTerm,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
  });
}

/**
 * Hook to get favourite recipes
 * 
 * @returns Query result with data, isLoading, error, etc.
 */
export function useFavouriteRecipes() {
  return useQuery<Recipe[], Error>({
    queryKey: ["recipes", "favourites"],
    queryFn: async () => {
      const response = await api.getFavouriteRecipes();
      return Array.isArray(response.results) ? response.results : [];
    },
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
  });
}

/**
 * Hook to get recipe summary by ID
 * 
 * @param recipeId - Recipe ID string
 * @param enabled - Whether to enable the query (default: true)
 * @returns Query result with data, isLoading, error, etc.
 */
export function useRecipeSummary(recipeId: string | undefined, enabled: boolean = true) {
  return useQuery<RecipeSummary, Error>({
    queryKey: ["recipes", "summary", recipeId],
    queryFn: () => api.getRecipeSummary(recipeId!),
    enabled: enabled && !!recipeId,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnMount: true,
  });
}

/**
 * Hook to add a recipe to favourites
 * 
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useAddFavouriteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Recipe) => api.addFavouriteRecipe(recipe),
    onSuccess: () => {
      // Invalidate favourites query to refetch (using centralized utility)
      invalidateFavouritesQueries(queryClient);
      toast.success("Recipe added to favourites!");
    },
    onError: (error: any) => {
      if (error?.message?.includes("already")) {
        toast.info("Recipe is already in favourites.");
      } else {
        toast.error("Failed to add recipe to favourites.");
      }
    },
  });
}

/**
 * Hook to remove a recipe from favourites
 * 
 * @returns Mutation object with mutate, mutateAsync, isLoading, error, etc.
 */
export function useRemoveFavouriteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipe: Recipe) => api.removeFavouriteRecipe(recipe),
    onSuccess: () => {
      // Invalidate favourites query to refetch (using centralized utility)
      invalidateFavouritesQueries(queryClient);
      toast.success("Recipe removed from favourites!");
    },
    onError: () => {
      toast.error("Failed to remove recipe from favourites.");
    },
  });
}

