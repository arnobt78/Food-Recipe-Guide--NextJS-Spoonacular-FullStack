/**
 * Skeleton Loading Component for Recipe Detail Card
 * 
 * Matches exact dimensions and layout of RecipeDetailCard component
 * Used during loading states for consistent UI
 */

import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const SkeletonRecipeDetail = () => {
  return (
    <Card className="glow-card border-purple-500/30 overflow-hidden w-full">
      {/* Header Skeleton */}
      <CardHeader className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/30">
        <div className="flex items-start justify-between gap-4">
          {/* Title Skeleton */}
          <Skeleton className="h-10 w-3/4" />
          {/* Buttons Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Image Skeleton */}
          <div className="lg:w-1/3 relative overflow-hidden">
            <div className="aspect-square lg:aspect-auto lg:h-full relative">
              <Skeleton className="w-full h-full" />
            </div>
          </div>

          {/* Right Side - Content Skeleton */}
          <div className="lg:w-2/3 p-6 space-y-6">
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

            {/* Footer Skeleton */}
            <div className="mt-6 pt-6 border-t border-purple-500/20">
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonRecipeDetail;

