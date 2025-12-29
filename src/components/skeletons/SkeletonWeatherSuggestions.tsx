/**
 * Skeleton Loading Component for Weather-Based Suggestions
 *
 * Exact-dimension skeleton matching WeatherBasedSuggestions component layout
 * Following DEVELOPMENT_RULES.md: Exact-dimension skeletons
 */

import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import SkeletonRecipeGrid from "./SkeletonRecipeGrid";

/**
 * Skeleton Loading Component for Weather-Based Suggestions
 *
 * Exact-dimension skeleton matching WeatherBasedSuggestions component layout
 * Following DEVELOPMENT_RULES.md: Exact-dimension skeletons
 */
const SkeletonWeatherSuggestions = () => {
  return (
    <div className="space-y-6">
      {/* Weather Widget Header Skeleton */}
      <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location Input Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          {/* Weather Display Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          {/* AI Reasoning Skeleton */}
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
      {/* Recipe Suggestions Skeleton */}
      <SkeletonRecipeGrid count={6} />
    </div>
  );
};

export default SkeletonWeatherSuggestions;

