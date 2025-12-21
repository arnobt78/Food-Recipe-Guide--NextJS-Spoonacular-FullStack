/**
 * Consolidated Recipe Detail API Handler (Catch-All Route)
 * 
 * Handles multiple recipe detail endpoints using Vercel catch-all routing:
 * - /api/recipes/[recipeId]/information → action[0] === "information"
 * - /api/recipes/[recipeId]/similar → action[0] === "similar"
 * - /api/recipes/[recipeId]/summary → action[0] === "summary"
 * 
 * All original code preserved, consolidated to reduce serverless function count.
 * Frontend calls remain exactly the same - no changes needed.
 */

import "dotenv/config";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { getRecipeInformation, getSimilarRecipes, getRecipeSummary } from "../../../lib/recipe-api.js";
import {
  setCorsHeaders,
  handleCorsPreflight,
} from "../../../lib/api-utils.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle CORS preflight
  if (handleCorsPreflight(request, response)) {
    return;
  }

  setCorsHeaders(response);

  // Extract recipeId from dynamic route parameter [recipeId]
  const recipeId = (request.query.recipeId as string) || "";

  if (!recipeId || !/^\d+$/.test(recipeId)) {
    return response.status(400).json({ error: "Valid recipe ID is required" });
  }

  // Extract action from catch-all route: [...action]
  const path = request.query.action as string[] || [];
  const action = path[0];

  // Only allow GET method
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Route: /api/recipes/[recipeId]/information
    if (action === "information") {
      const options = {
        includeNutrition: request.query.includeNutrition === "true",
        addWinePairing: request.query.addWinePairing === "true",
        addTasteData: request.query.addTasteData === "true",
      };

      const results = await getRecipeInformation(recipeId, options);
      return response.status(200).json(results);
    }

    // Route: /api/recipes/[recipeId]/similar
    if (action === "similar") {
      const number = request.query.number 
        ? parseInt(request.query.number as string, 10) 
        : 10;

      if (isNaN(number) || number < 1 || number > 100) {
        return response.status(400).json({ error: "Number must be between 1 and 100" });
      }

      const results = await getSimilarRecipes(recipeId, number);
      return response.status(200).json(results);
    }

    // Route: /api/recipes/[recipeId]/summary
    if (action === "summary") {
      const results = await getRecipeSummary(recipeId);
      return response.status(200).json(results);
    }

    // Unknown action
    return response.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error(`❌ [Recipe Detail API] Error (${action}):`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("limit") || errorMessage.includes("402") ? 402 : 500;
    return response.status(statusCode).json({ 
      error: "Failed to fetch recipe data",
      message: errorMessage
    });
  }
}

