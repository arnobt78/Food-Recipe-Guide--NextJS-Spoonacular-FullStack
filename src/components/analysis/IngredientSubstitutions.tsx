/**
 * Ingredient Substitutions Component
 *
 * Reusable component for displaying AI-suggested ingredient substitutions
 * Features:
 * - Original ingredient and suggested substitute
 * - Reason for substitution
 * - Dietary benefits
 * - Uses ShadCN UI components
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks
 */

import { memo } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { RefreshCw, Sparkles } from "lucide-react";

interface IngredientSubstitution {
  original: string;
  substitute: string;
  reason?: string;
  dietaryBenefit?: string;
}

interface IngredientSubstitutionsProps {
  substitutions?: IngredientSubstitution[];
  className?: string;
}

/**
 * Ingredient Substitutions Component (Memoized for performance)
 *
 * Displays AI-suggested ingredient substitutions
 */
const IngredientSubstitutions = memo(
  ({ substitutions = [], className = "" }: IngredientSubstitutionsProps) => {
    if (substitutions.length === 0) {
      return null;
    }

    return (
      <Card
        className={`rounded-[28px] border border-purple-400/30 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-[0_30px_80px_rgba(168,85,247,0.25)] min-w-0 overflow-hidden ${className}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 min-w-0">
            {/* Header: icon + title only inline (title can wrap); subtitle/body start from same left as icon */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                Ingredient Substitutions
              </h3>
            </div>
            {/* Content from start (same left as icon) */}
            <div className="min-w-0">
              <p className="text-sm text-gray-400 mb-3">AI-suggested alternatives</p>

            {/* Substitutions List */}
            <div className="space-y-3 min-w-0">
              {substitutions.map((sub, index) => (
                <div
                  key={index}
                  className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg min-w-0"
                >
                  <div className="space-y-2 min-w-0">
                    {/* Original → Substitute */}
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="text-gray-300 font-medium break-words">{sub.original}</span>
                      <span className="text-purple-400 flex-shrink-0">→</span>
                      <span className="text-green-300 font-medium break-words">{sub.substitute}</span>
                    </div>

                    {/* Reason */}
                    {sub.reason && (
                      <div className="flex items-start gap-2 text-sm text-gray-400 min-w-0">
                        <Sparkles className="h-3 w-3 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="break-words">{sub.reason}</span>
                      </div>
                    )}

                    {/* Dietary Benefit */}
                    {sub.dietaryBenefit && (
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/10 border-green-500/30 text-green-300 w-fit"
                        >
                          {sub.dietaryBenefit}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

IngredientSubstitutions.displayName = "IngredientSubstitutions";

export default IngredientSubstitutions;

