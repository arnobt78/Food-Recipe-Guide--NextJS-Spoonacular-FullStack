/**
 * Recipe Modifications Component
 *
 * Unified component for recipe scaling, dietary modifications, and simplification
 * Features:
 * - Recipe scaling (servings adjustment with proportional ingredient scaling)
 * - Dietary modifications (AI-powered conversion to vegan, keto, gluten-free, etc.)
 * - Recipe simplification (AI-powered simplification for beginners)
 * - Unit conversion (metric/imperial)
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks, ShadCN UI
 */

import { memo, useState, useMemo } from "react";
import { useRecipeModification } from "../../hooks/useRecipes";
import { RecipeInformation } from "../../types";
import { scaleRecipeIngredients } from "../../utils/recipeScaling";
import { addTargetBlankToLinks } from "../../utils/stringUtils";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Sparkles,
  Scale,
  UtensilsCrossed,
  Lightbulb,
  ListOrdered,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import EmptyState from "../common/EmptyState";
import { Skeleton } from "../ui/skeleton";

interface RecipeModificationsProps {
  recipeInfo: RecipeInformation;
  activeSubTab?: string;
  className?: string;
}

/**
 * Recipe Modifications Component (Memoized for performance)
 *
 * Provides recipe scaling, dietary modifications, and simplification features
 */
const RecipeModifications = memo(
  ({
    recipeInfo,
    activeSubTab = "scale",
    className = "",
  }: RecipeModificationsProps) => {
    const [targetServings, setTargetServings] = useState<number>(
      recipeInfo.servings || 4,
    );
    const [selectedDiet, setSelectedDiet] = useState<string>("vegan");

    // Scale recipe ingredients
    const scaledIngredients = useMemo(() => {
      if (activeSubTab !== "scale") return [];
      return scaleRecipeIngredients(
        recipeInfo,
        targetServings,
        recipeInfo.servings,
      );
    }, [recipeInfo, targetServings, activeSubTab]);

    // Fetch dietary modification
    const {
      data: dietaryModification,
      isLoading: isDietaryLoading,
      error: dietaryError,
    } = useRecipeModification(
      recipeInfo.id,
      "dietary",
      selectedDiet,
      activeSubTab === "dietary" && !!recipeInfo.id,
    );

    // Fetch simplification
    const {
      data: simplification,
      isLoading: isSimplificationLoading,
      error: simplificationError,
    } = useRecipeModification(
      recipeInfo.id,
      "simplify",
      undefined,
      activeSubTab === "simplify" && !!recipeInfo.id,
    );

    const handleCopyIngredients = (ingredients: string[]) => {
      navigator.clipboard.writeText(ingredients.join("\n"));
      toast.success("Ingredients copied to clipboard!");
    };

    return (
      <Card
        className={`group rounded-[28px] border border-slate-400/30 bg-gradient-to-br from-slate-500/25 via-slate-500/10 to-slate-500/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(71,85,105,0.35)] transition hover:border-slate-300/50 ${className}`}
      >
        <CardContent className="p-4 sm:p-6 bg-transparent">
          {/* Scaling Tab - icon+title only; content from same left as icon; stack on phone */}
          {activeSubTab === "scale" && (
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                  <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                  Scale Recipe
                </h3>
              </div>
              {/* Content from start (same left as icon) */}
              <div className="min-w-0">
                <p className="text-sm text-white/60 mb-3">
                  Adjust servings and ingredient amounts
                </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                  <label className="text-sm text-white/60">
                    Target Servings:
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={targetServings}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value > 0 && value <= 20) {
                        setTargetServings(value);
                      }
                    }}
                    className="w-24 bg-slate-900/30 backdrop-blur-sm border-slate-400/30 text-white rounded-xl flex-shrink-0"
                  />
                </div>
                <Badge className="inline-flex items-center px-2 py-1 text-xs font-medium w-fit bg-emerald-500/20 backdrop-blur-sm text-emerald-300 border-emerald-500/30">
                  Original: {recipeInfo.servings} servings
                </Badge>
              </div>

              {scaledIngredients.length > 0 ? (
                <div className="space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-8 h-8">
                        <ListOrdered className="h-4 w-4 text-orange-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-white break-words">
                        Scaled Ingredients
                      </h4>
                    </div>
                    <Button
                      type="button"
                      onClick={() =>
                        handleCopyIngredients(
                          scaledIngredients.map((ing) => ing.scaled),
                        )
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/70 via-emerald-500/50 to-emerald-500/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.45)] transition duration-200 hover:border-emerald-300/40 hover:from-emerald-500/80 hover:via-emerald-500/60 hover:to-emerald-500/40 backdrop-blur-sm w-fit self-start sm:self-center"
                    >
                      Copy All
                    </Button>
                  </div>
                  <div className="space-y-2 min-w-0">
                    {scaledIngredients.map((ing, index) => (
                      <Card
                        key={index}
                        className="group rounded-[28px] border border-orange-400/30 bg-gradient-to-br from-orange-500/25 via-orange-500/10 to-orange-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(249,115,22,0.35)] transition hover:border-orange-300/50 backdrop-blur-sm min-w-0 overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-2 min-w-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-base sm:text-xl font-semibold text-white break-words">
                              {ing.scaled}
                            </p>
                            {ing.original !== ing.scaled && (
                              <p className="text-xs text-white/60 mt-2 line-through break-words">
                                {ing.original}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="No ingredients available for scaling." />
              )}
              </div>
            </div>
          )}

          {/* Dietary Modification Tab - icon+title only; content from same left as icon */}
          {activeSubTab === "dietary" && (
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-emerald-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                  <UtensilsCrossed className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                  Dietary Modifications
                </h3>
              </div>
              {/* Content from start (same left as icon) */}
              <div className="min-w-0">
                <p className="text-sm text-white/60 mb-3">
                  Convert to vegan, keto, gluten-free, and more
                </p>

              <div className="flex flex-wrap items-center gap-2 min-w-0 mb-4">
                <label className="text-sm text-white/60">Convert to:</label>
                {["vegan", "keto", "gluten-free", "dairy-free"].map((diet) => (
                  <Button
                    key={diet}
                    type="button"
                    onClick={() => setSelectedDiet(diet)}
                    className={
                      selectedDiet === diet
                        ? "inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/70 via-emerald-500/50 to-emerald-500/30 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.45)] transition duration-200 hover:border-emerald-300/40 hover:from-emerald-500/80 hover:via-emerald-500/60 hover:to-emerald-500/40 backdrop-blur-sm w-fit"
                        : "inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-slate-500/70 via-slate-500/50 to-slate-500/30 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white/60 shadow-[0_15px_35px_rgba(71,85,105,0.25)] transition duration-200 hover:border-slate-300/40 hover:from-slate-500/80 hover:via-slate-500/60 hover:to-slate-500/40 backdrop-blur-sm w-fit"
                    }
                  >
                    {diet.charAt(0).toUpperCase() + diet.slice(1)}
                  </Button>
                ))}
              </div>

              {isDietaryLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : dietaryError ? (
                <EmptyState
                  message="Failed to load dietary modification."
                  subtitle={dietaryError.message}
                />
              ) : dietaryModification ? (
                <div className="space-y-4 min-w-0">
                  {dietaryModification.explanation && (
                    <Card className="group rounded-[28px] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-emerald-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(16,185,129,0.35)] transition hover:border-emerald-300/50 backdrop-blur-sm min-w-0 overflow-hidden">
                      <div className="flex items-start gap-2 min-w-0">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-white/70 leading-relaxed break-words min-w-0">
                          {dietaryModification.explanation}
                        </p>
                      </div>
                    </Card>
                  )}

                  {dietaryModification.modifiedIngredients &&
                    dietaryModification.modifiedIngredients.length > 0 && (
                      <div className="space-y-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-pink-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <ListOrdered className="h-4 w-4 text-pink-400" />
                            </div>
                            <h4 className="text-base sm:text-lg font-semibold text-white break-words">
                              Modified Ingredients
                            </h4>
                          </div>
                          <Button
                            type="button"
                            onClick={() =>
                              handleCopyIngredients(
                                dietaryModification.modifiedIngredients!.map(
                                  (ing) =>
                                    `${ing.substitute} (instead of ${ing.original})`,
                                ),
                              )
                            }
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/70 via-emerald-500/50 to-emerald-500/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.45)] transition duration-200 hover:border-emerald-300/40 hover:from-emerald-500/80 hover:via-emerald-500/60 hover:to-emerald-500/40 backdrop-blur-sm w-fit self-start sm:self-center"
                          >
                            Copy All
                          </Button>
                        </div>
                        <div className="space-y-2 min-w-0">
                          {dietaryModification.modifiedIngredients.map(
                            (ing, index) => (
                              <Card
                                key={index}
                                className="group rounded-[28px] border border-pink-400/30 bg-gradient-to-br from-pink-500/25 via-pink-500/10 to-pink-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(236,72,153,0.35)] transition hover:border-pink-300/50 backdrop-blur-sm min-w-0 overflow-hidden"
                              >
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 min-w-0">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-base sm:text-xl font-semibold text-white break-words">
                                      {ing.substitute}
                                    </p>
                                    <p className="text-xs text-white/60 mt-2 line-through break-words">
                                      {ing.original}
                                    </p>
                                    {ing.reason && (
                                      <p className="text-xs text-pink-300 mt-2 break-words">
                                        {ing.reason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {dietaryModification.modifiedInstructions && (
                    <Card className="group rounded-[28px] border border-indigo-400/30 bg-gradient-to-br from-indigo-500/25 via-indigo-500/10 to-indigo-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(99,102,241,0.35)] transition hover:border-indigo-300/50 backdrop-blur-sm min-w-0 overflow-hidden">
                      <div className="space-y-4 min-w-0">
                        {/* Header: icon + title only */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-indigo-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                            Modified Instructions
                          </h4>
                        </div>
                        {/* Body from start (same left as icon); reset ol/ul/li default padding */}
                        <div className="min-w-0 w-full [&_ol]:!pl-0 [&_ul]:!pl-0 [&_li]:!pl-0 [&_li]:!ml-0 [&_p]:!pl-0">
                          <div
                            className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed overflow-x-hidden break-words min-w-0 text-sm sm:text-base !pl-0 [&_ol]:!pl-0 [&_ul]:!pl-0 [&_li]:!pl-0 [&_li]:!ml-0 [&_p]:!pl-0"
                            dangerouslySetInnerHTML={{
                              __html: addTargetBlankToLinks(
                                dietaryModification.modifiedInstructions,
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <EmptyState message="No dietary modification available." />
              )}
              </div>
            </div>
          )}

          {/* Simplification Tab - icon+title only; content from same left as icon */}
          {activeSubTab === "simplify" && (
            <div className="space-y-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-sky-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-sky-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                  Simplify Recipe
                </h3>
              </div>
              {/* Content from start (same left as icon) */}
              <div className="min-w-0">
                <p className="text-sm text-white/60 mb-3">
                  Beginner-friendly ingredients and steps
                </p>

              {isSimplificationLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : simplificationError ? (
                <EmptyState
                  message="Failed to load simplification."
                  subtitle={simplificationError.message}
                />
              ) : simplification ? (
                <div className="space-y-4 min-w-0">
                  {simplification.simplifiedIngredients &&
                    simplification.simplifiedIngredients.length > 0 && (
                      <div className="space-y-3 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-sky-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-8 h-8">
                              <ListOrdered className="h-4 w-4 text-sky-400" />
                            </div>
                            <h4 className="text-base sm:text-lg font-semibold text-white break-words">
                              Simplified Ingredients
                            </h4>
                          </div>
                          <Button
                            type="button"
                            onClick={() =>
                              handleCopyIngredients(
                                simplification.simplifiedIngredients!.map(
                                  (ing) => ing.simplified,
                                ),
                              )
                            }
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/70 via-emerald-500/50 to-emerald-500/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.45)] transition duration-200 hover:border-emerald-300/40 hover:from-emerald-500/80 hover:via-emerald-500/60 hover:to-emerald-500/40 backdrop-blur-sm w-fit self-start sm:self-center"
                          >
                            Copy All
                          </Button>
                        </div>
                        <div className="space-y-2 min-w-0">
                          {simplification.simplifiedIngredients.map(
                            (ing, index) => (
                              <Card
                                key={index}
                                className="group rounded-[28px] border border-sky-400/30 bg-gradient-to-br from-sky-500/25 via-sky-500/10 to-sky-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(14,165,233,0.35)] transition hover:border-sky-300/50 backdrop-blur-sm min-w-0 overflow-hidden"
                              >
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 min-w-0">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-base sm:text-xl font-semibold text-white break-words">
                                      {ing.simplified}
                                    </p>
                                    {ing.original !== ing.simplified && (
                                      <p className="text-xs text-white/60 mt-2 line-through break-words">
                                        {ing.original}
                                      </p>
                                    )}
                                    {ing.reason && (
                                      <p className="text-xs text-sky-300 mt-2 break-words">
                                        {ing.reason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {simplification.simplifiedInstructions && (
                    <Card className="group rounded-[28px] border border-indigo-400/30 bg-gradient-to-br from-indigo-500/25 via-indigo-500/10 to-indigo-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(99,102,241,0.35)] transition hover:border-indigo-300/50 backdrop-blur-sm min-w-0 overflow-hidden">
                      <div className="space-y-4 min-w-0">
                        {/* Header: icon + title only */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-indigo-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10">
                            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                          </div>
                          <h4 className="text-base sm:text-lg font-semibold text-white leading-tight break-words min-w-0 flex-1">
                            Simplified Instructions
                          </h4>
                        </div>
                        {/* Body from start (same left as icon); reset ol/ul/li default padding */}
                        <div className="min-w-0 w-full [&_ol]:!pl-0 [&_ul]:!pl-0 [&_li]:!pl-0 [&_li]:!ml-0 [&_p]:!pl-0">
                          <div
                            className="prose prose-invert prose-lg max-w-none text-white/70 leading-relaxed overflow-x-hidden break-words min-w-0 text-sm sm:text-base !pl-0 [&_ol]:!pl-0 [&_ul]:!pl-0 [&_li]:!pl-0 [&_li]:!ml-0 [&_p]:!pl-0"
                            dangerouslySetInnerHTML={{
                              __html: addTargetBlankToLinks(
                                simplification.simplifiedInstructions,
                              ),
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  )}

                  {simplification.tips && simplification.tips.length > 0 && (
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0 flex items-center justify-center w-8 h-8">
                          <Sparkles className="h-4 w-4 text-amber-400" />
                        </div>
                        <h4 className="text-base sm:text-lg font-semibold text-white break-words">
                          Tips for Beginners
                        </h4>
                      </div>
                      <div className="space-y-2 min-w-0">
                        {simplification.tips.map((tip, index) => (
                          <Card
                            key={index}
                            className="group rounded-[28px] border border-amber-400/30 bg-gradient-to-br from-amber-500/30 via-amber-500/15 to-amber-500/5 p-4 sm:p-6 shadow-[0_30px_80px_rgba(245,158,11,0.35)] transition hover:border-amber-300/60 backdrop-blur-sm min-w-0 overflow-hidden"
                          >
                            <div className="flex items-start gap-2 min-w-0">
                              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-300 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-white/70 break-words min-w-0">
                                {tip}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState message="No simplification available." />
              )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

RecipeModifications.displayName = "RecipeModifications";

export default RecipeModifications;
