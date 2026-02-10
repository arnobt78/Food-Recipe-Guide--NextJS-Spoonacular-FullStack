/**
 * Reusable Collection Detail View Component
 *
 * Features:
 * - Display collection details
 * - Show recipes in collection
 * - Remove recipes from collection
 * - Edit collection
 * - Back navigation
 * - ShadCN UI components
 * - React Query integration
 * - Skeleton loading
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks
 */

import { memo, useCallback, useState } from "react";
import {
  useCollection,
  useCollectionRecipes,
  useRemoveRecipeFromCollection,
  useUpdateCollection,
  useDeleteCollection,
} from "../../hooks/useCollections";
import RecipeGrid from "../recipes/RecipeGrid";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowLeft, Edit2, Trash2, Folder } from "lucide-react";
import { RecipeCollection, Recipe } from "../../types";
import EmptyState from "../common/EmptyState";
import SkeletonCollectionDetail from "../skeletons/SkeletonCollectionDetail";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Save } from "lucide-react";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { toast } from "sonner";

interface CollectionDetailViewProps {
  collection: RecipeCollection;
  onBack: () => void;
  onRecipeClick?: (recipe: Recipe) => void;
  onDelete?: () => void;
}

/**
 * Collection Detail View Component (Memoized for performance)
 *
 * Displays collection details and recipes
 */
const CollectionDetailView = memo(
  ({ collection, onBack, onDelete }: CollectionDetailViewProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(collection.name);
    const [editDescription, setEditDescription] = useState(
      collection.description || "",
    );

    const { data: collectionData, isLoading: isCollectionLoading } =
      useCollection(collection.id, true);
    const { data: recipesData, isLoading: isRecipesLoading } =
      useCollectionRecipes(collection.id, true);
    const removeRecipe = useRemoveRecipeFromCollection();
    const updateCollection = useUpdateCollection();
    const deleteCollection = useDeleteCollection();
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [recipeToRemove, setRecipeToRemove] = useState<Recipe | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Use full recipe details from Spoonacular API (includes calories, time, dietary info, etc.)
    const recipes: Recipe[] = recipesData?.results || [];

    // Combined loading state
    const isLoading = isCollectionLoading || isRecipesLoading;

    const handleRemoveRecipeClick = useCallback((recipe: Recipe) => {
      setRecipeToRemove(recipe);
      setRemoveDialogOpen(true);
    }, []);

    const handleRemoveConfirm = useCallback(() => {
      if (recipeToRemove) {
        removeRecipe.mutate({
          collectionId: collection.id,
          recipeId: recipeToRemove.id,
        });
        setRecipeToRemove(null);
      }
    }, [recipeToRemove, collection.id, removeRecipe]);

    const handleSaveEdit = useCallback(() => {
      if (!editName.trim()) {
        toast.error("Collection name is required");
        return;
      }

      updateCollection.mutate(
        {
          collectionId: collection.id,
          updates: {
            name: editName.trim(),
            description: editDescription.trim() || undefined,
          },
        },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        },
      );
    }, [collection.id, editName, editDescription, updateCollection]);

    const handleCancelEdit = useCallback(() => {
      setEditName(collection.name);
      setEditDescription(collection.description || "");
      setIsEditing(false);
    }, [collection]);

    if (isLoading) {
      return <SkeletonCollectionDetail />;
    }

    return (
      <div className="space-y-6 min-w-0">
        {/* Header - back arrow stacked on phone, inline on sm+ */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-purple-500/20 self-start sm:self-auto border-2 border-gray-500/30 bg-blue-500/20 rounded-md"
            aria-label="Back to collections"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {isEditing ? (
            <Card className="glow-card border-purple-500/30 flex-1 min-w-0">
              <CardContent className="pt-6 space-y-4">
                <Input
                  placeholder="Collection name *"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-slate-800/50 border-purple-500/30 text-white"
                  aria-label="Collection name"
                  aria-required="true"
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-slate-800/50 border-purple-500/30 text-white min-h-[80px]"
                  aria-label="Collection description"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={!editName.trim() || updateCollection.isPending}
                    className="glow-button flex items-center gap-2"
                    aria-label={
                      updateCollection.isPending
                        ? "Saving collection changes"
                        : "Save collection changes"
                    }
                  >
                    <Save className="h-4 w-4" />
                    {updateCollection.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="text-gray-400 hover:text-white border-2 border-gray-500/30 rounded-md px-4 py-1"
                    aria-label="Cancel editing collection"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glow-card border-purple-500/30 flex-1 min-w-0 overflow-hidden">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
                  <div className="min-w-0">
                    {/* Icon + title inline (same as other page headers) */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: collection.color
                            ? `${collection.color}20`
                            : "rgba(139, 92, 246, 0.2)",
                        }}
                      >
                        <Folder
                          className="w-6 h-6 sm:w-7 sm:h-7"
                          style={{
                            color: collection.color || "#8b5cf6",
                          }}
                        />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-white break-words">
                        {collectionData?.name || collection.name}
                      </CardTitle>
                    </div>
                    {collectionData?.description && (
                      <p className="text-sm text-gray-300 mt-2 break-words">
                        {collectionData.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="glow-badge"
                        style={{
                          borderColor: collection.color
                            ? `${collection.color}40`
                            : "rgba(139, 92, 246, 0.3)",
                        }}
                      >
                        {collectionData?.itemCount || recipes.length}{" "}
                        {recipes.length === 1 ? "recipe" : "recipes"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/20"
                      aria-label="Edit collection"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                        aria-label="Delete collection"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <EmptyState message="No recipes in this collection yet. Add recipes from the search tab!" />
        ) : (
          <RecipeGrid
            recipes={recipes}
            favouriteRecipes={[]}
            onFavouriteToggle={(recipe, isFavourite) => {
              if (isFavourite) {
                handleRemoveRecipeClick(recipe);
              }
            }}
            showRemoveFromCollection={true}
          />
        )}

        {/* Remove Recipe Confirmation Dialog */}
        <ConfirmationDialog
          open={removeDialogOpen}
          onOpenChange={setRemoveDialogOpen}
          title="Remove Recipe"
          description={`Remove "${recipeToRemove?.title}" from this collection?`}
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={handleRemoveConfirm}
          variant="default"
        />

        {/* Delete Collection Confirmation Dialog */}
        {onDelete && (
          <ConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Collection"
            description={`Are you sure you want to delete "${collectionData?.name || collection.name}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              deleteCollection.mutate(collection.id, {
                onSuccess: () => {
                  onDelete();
                },
              });
            }}
            variant="destructive"
          />
        )}
      </div>
    );
  },
);

CollectionDetailView.displayName = "CollectionDetailView";

export default CollectionDetailView;
