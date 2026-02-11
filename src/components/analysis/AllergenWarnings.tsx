/**
 * Allergen Warnings Component
 *
 * Reusable component for displaying allergen information
 * Features:
 * - Allergen name and severity
 * - Sources of allergens (ingredients)
 * - Color-coded severity indicators
 * - Uses ShadCN UI components
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks
 */

import { memo } from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertTriangle, Sparkles } from "lucide-react";

interface Allergen {
  allergen: string;
  severity: "low" | "medium" | "high";
  sources?: string[];
}

interface AllergenWarningsProps {
  allergens?: Allergen[];
  className?: string;
}

/**
 * Allergen Warnings Component (Memoized for performance)
 *
 * Displays allergen information with severity indicators
 */
const AllergenWarnings = memo(
  ({ allergens = [], className = "" }: AllergenWarningsProps) => {
    if (allergens.length === 0) {
      return null;
    }

    const getSeverityColor = (severity: "low" | "medium" | "high"): string => {
      switch (severity) {
        case "high":
          return "text-red-400 border-red-500/30 bg-red-500/10";
        case "medium":
          return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
        case "low":
          return "text-blue-400 border-blue-500/30 bg-blue-500/10";
        default:
          return "text-gray-400 border-gray-500/30 bg-gray-500/10";
      }
    };

    const getSeverityLabel = (severity: "low" | "medium" | "high"): string => {
      switch (severity) {
        case "high":
          return "High Risk";
        case "medium":
          return "Moderate Risk";
        case "low":
          return "Low Risk";
        default:
          return "Unknown";
      }
    };

    return (
      <Card
        className={`rounded-[28px] border border-red-400/30 bg-gradient-to-br from-red-900/30 to-orange-900/30 shadow-[0_30px_80px_rgba(239,68,68,0.25)] min-w-0 overflow-hidden ${className}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4 min-w-0">
            {/* Header: icon + title only inline (title can wrap); content from same left as icon */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                Allergen Information
              </h3>
            </div>
            {/* Content from start (same left as icon) */}
            <div className="min-w-0">
              <p className="text-sm text-gray-400 mb-3">Detected allergens and sources</p>

            {/* Allergens List */}
            <div className="space-y-3 min-w-0">
              {allergens.map((allergen, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg min-w-0 ${getSeverityColor(allergen.severity)}`}
                >
                  <div className="space-y-2 min-w-0">
                    {/* Allergen Name and Severity */}
                    <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                      <span className="font-semibold capitalize break-words">{allergen.allergen}</span>
                      <Badge
                        variant="outline"
                        className={`${getSeverityColor(allergen.severity)} border-current inline-flex px-2 py-1 text-xs font-medium w-fit flex-shrink-0`}
                      >
                        {getSeverityLabel(allergen.severity)}
                      </Badge>
                    </div>

                    {/* Sources: badges dynamic wrap */}
                    {allergen.sources && allergen.sources.length > 0 && (
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Sparkles className="h-3 w-3 flex-shrink-0" />
                          <span>Found in:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-5 min-w-0">
                          {allergen.sources.map((source, sourceIndex) => (
                            <Badge
                              key={sourceIndex}
                              variant="outline"
                              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-slate-700/50 border-slate-600 text-gray-300 w-fit"
                            >
                              {source}
                            </Badge>
                          ))}
                        </div>
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

AllergenWarnings.displayName = "AllergenWarnings";

export default AllergenWarnings;

