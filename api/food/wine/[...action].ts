/**
 * Consolidated Food/Wine API Handler (Catch-All Route)
 * 
 * Handles multiple food/wine endpoints using Vercel catch-all routing:
 * - /api/food/wine/dishes → action[0] === "dishes"
 * - /api/food/wine/pairing → action[0] === "pairing"
 * 
 * All original code preserved, consolidated to reduce serverless function count.
 * Frontend calls remain exactly the same - no changes needed.
 */

import "dotenv/config";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { getDishPairingForWine, getWinePairing } from "../../../lib/recipe-api.js";
import { setCorsHeaders, handleCorsPreflight } from "../../../lib/api-utils.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Handle CORS preflight
  if (handleCorsPreflight(request, response)) {
    return;
  }

  // Only allow GET method
  if (request.method !== "GET") {
    setCorsHeaders(response);
    return response.status(405).json({ error: "Method not allowed" });
  }

  setCorsHeaders(response);

  // Extract action from catch-all route: [...action]
  const path = request.query.action as string[] || [];
  const action = path[0];

  try {
    // Route: /api/food/wine/dishes
    if (action === "dishes") {
      const wine = request.query.wine as string;

      if (!wine || wine.trim().length === 0) {
        return response.status(400).json({ error: "Wine type is required" });
      }

      const results = await getDishPairingForWine(wine);
      return response.status(200).json(results);
    }

    // Route: /api/food/wine/pairing
    if (action === "pairing") {
      const food = request.query.food as string;
      const maxPrice = request.query.maxPrice
        ? parseFloat(request.query.maxPrice as string)
        : undefined;

      if (!food || food.trim().length === 0) {
        return response.status(400).json({ error: "Food name is required" });
      }

      // Validate maxPrice if provided
      if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
        return response.status(400).json({ error: "maxPrice must be a positive number" });
      }

      const results = await getWinePairing(food, maxPrice);
      return response.status(200).json(results);
    }

    // Unknown action
    return response.status(404).json({ error: "Not found" });
  } catch (error) {
    console.error(`❌ [Food/Wine API] Error (${action}):`, error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const statusCode = errorMessage.includes("limit") || errorMessage.includes("402") ? 402 : 500;
    return response.status(statusCode).json({ 
      error: "Failed to process request",
      message: errorMessage
    });
  }
}

