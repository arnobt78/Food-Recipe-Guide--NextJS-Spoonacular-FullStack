/**
 * TypeScript Type Definitions
 * 
 * Centralized type definitions for the entire application
 * Ensures type safety and consistency across components
 */

/**
 * Recipe interface - matches Spoonacular API response
 */
export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

/**
 * Recipe Summary interface - matches Spoonacular API response
 */
export interface RecipeSummary {
  id: number;
  title: string;
  summary: string;
}

/**
 * Search Recipes Response interface
 */
export interface SearchRecipesResponse {
  results?: Recipe[];
  status?: "failure" | "success";
  code?: number;
  message?: string;
  totalResults?: number;
  offset?: number;
  number?: number;
}

/**
 * Favourite Recipes Response interface
 */
export interface FavouriteRecipesResponse {
  results: Recipe[];
  _message?: string;
}

/**
 * Tab type for navigation
 */
export type TabType = "search" | "favourites";
