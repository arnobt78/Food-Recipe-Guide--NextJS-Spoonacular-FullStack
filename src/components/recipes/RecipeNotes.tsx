/**
 * Reusable Recipe Notes Component
 *
 * Features:
 * - View recipe notes
 * - Create/edit notes
 * - Rating system
 * - Tags support
 * - ShadCN UI components
 * - React Query integration
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks
 */

import { memo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  useRecipeNote,
  useSaveRecipeNote,
  useDeleteRecipeNote,
} from "../../hooks/useRecipeNotes";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Star, Save, Trash2, Edit2, X, Plus } from "lucide-react";
import { Recipe } from "../../types";
import SkeletonRecipeDetail from "../skeletons/SkeletonRecipeDetail";
import ConfirmationDialog from "../common/ConfirmationDialog";

interface RecipeNotesProps {
  recipe: Recipe;
}

/**
 * Recipe Notes Component (Memoized for performance)
 *
 * Allows users to add personal notes, ratings, and tags to recipes
 */
const RecipeNotes = memo(({ recipe }: RecipeNotesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { data: note, isLoading } = useRecipeNote(recipe.id, true);
  const saveNote = useSaveRecipeNote();
  const deleteNote = useDeleteRecipeNote();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Initialize form with existing note data
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setRating(note.rating);
      setTags(note.tags || []);
      setIsEditing(false);
    } else {
      setTitle("");
      setContent("");
      setRating(undefined);
      setTags([]);
      setIsEditing(true);
    }
  }, [note]);

  const handleSave = useCallback(() => {
    if (!content.trim()) return;

    saveNote.mutate(
      {
        recipeId: recipe.id,
        title: title.trim() || undefined,
        content: content.trim(),
        rating,
        tags,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }, [recipe.id, title, content, rating, tags, saveNote]);

  const handleDelete = useCallback(() => {
    deleteNote.mutate(recipe.id, {
      onSuccess: () => {
        setTitle("");
        setContent("");
        setRating(undefined);
        setTags([]);
        setIsEditing(true);
      },
    });
  }, [recipe.id, deleteNote]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    },
    [tags]
  );

  if (isLoading) {
    return <SkeletonRecipeDetail />;
  }

  return (
    <Card className="group rounded-[28px] border border-purple-400/30 bg-gradient-to-br from-purple-500/25 via-purple-500/10 to-purple-500/5 backdrop-blur-sm shadow-[0_30px_80px_rgba(168,85,247,0.35)] transition hover:border-purple-300/50">
      <CardContent className="p-4 sm:p-6 bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image
              src="/food.svg"
              alt="Notes"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              My Notes
            </h3>
          </div>
          {note && !isEditing && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-purple-500/70 via-purple-500/50 to-purple-500/30 px-3 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(168,85,247,0.45)] transition duration-200 hover:border-purple-300/40 hover:from-purple-500/80 hover:via-purple-500/60 hover:to-purple-500/40 backdrop-blur-sm"
                aria-label="Edit note"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-rose-500/70 via-rose-500/50 to-rose-500/30 px-3 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(225,29,72,0.45)] transition duration-200 hover:border-rose-300/40 hover:from-rose-500/80 hover:via-rose-500/60 hover:to-rose-500/40 backdrop-blur-sm"
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <Input
                placeholder="Note title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-900/30 backdrop-blur-sm border-purple-400/30 text-white rounded-xl"
                aria-label="Note title"
              />

              <Textarea
                placeholder="Write your notes here... (cooking tips, modifications, etc.)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-slate-900/30 backdrop-blur-sm border-purple-400/30 text-white min-h-[120px] rounded-xl"
                required
                aria-label="Recipe notes content"
                aria-required="true"
              />

              {/* Rating */}
              <Card className="group rounded-[28px] border border-amber-400/30 bg-gradient-to-br from-amber-500/30 via-amber-500/15 to-amber-500/5 p-4 backdrop-blur-sm shadow-[0_30px_80px_rgba(245,158,11,0.35)] transition hover:border-amber-300/60">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.45em] text-white/60">
                    Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRating(rating === star ? undefined : star)
                        }
                        className="focus:outline-none"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        aria-pressed={rating === star}
                      >
                        <Star
                          className={`h-6 w-6 transition-colors ${
                            rating && star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/60 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Tags */}
              <Card className="group rounded-[28px] border border-indigo-400/30 bg-gradient-to-br from-indigo-500/25 via-indigo-500/10 to-indigo-500/5 p-4 backdrop-blur-sm shadow-[0_30px_80px_rgba(99,102,241,0.35)] transition hover:border-indigo-300/50">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.45em] text-white/60">
                    Tags
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      className="bg-slate-900/30 backdrop-blur-sm border-indigo-400/30 text-white flex-1 rounded-xl"
                      aria-label="Add tag to recipe note"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-indigo-500/70 via-indigo-500/50 to-indigo-500/30 px-3 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(99,102,241,0.45)] transition duration-200 hover:border-indigo-300/40 hover:from-indigo-500/80 hover:via-indigo-500/60 hover:to-indigo-500/40 backdrop-blur-sm"
                      aria-label="Add tag"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-purple-500/20 backdrop-blur-sm text-purple-300 border-purple-500/30 flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-400"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!content.trim() || saveNote.isPending}
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-emerald-500/70 via-emerald-500/50 to-emerald-500/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(16,185,129,0.45)] transition duration-200 hover:border-emerald-300/40 hover:from-emerald-500/80 hover:via-emerald-500/60 hover:to-emerald-500/40 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={saveNote.isPending ? "Saving note" : "Save note"}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveNote.isPending ? "Saving..." : "Save Note"}
                </Button>
                {note && (
                  <Button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to note values
                      if (note) {
                        setTitle(note.title || "");
                        setContent(note.content || "");
                        setRating(note.rating);
                        setTags(note.tags || []);
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-r from-slate-500/70 via-slate-500/50 to-slate-500/30 px-4 py-2 text-sm font-semibold text-white/60 shadow-[0_15px_35px_rgba(71,85,105,0.25)] transition duration-200 hover:border-slate-300/40 hover:from-slate-500/80 hover:via-slate-500/60 hover:to-slate-500/40 backdrop-blur-sm"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </>
          ) : note ? (
            <>
              {note.title && (
                <Card className="group rounded-[28px] border border-sky-400/30 bg-gradient-to-br from-sky-500/25 via-sky-500/10 to-sky-500/5 p-6 backdrop-blur-sm shadow-[0_30px_80px_rgba(14,165,233,0.35)] transition hover:border-sky-300/50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                        Note Title
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">
                        {note.title}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              <Card className="group rounded-[28px] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-emerald-500/5 p-6 backdrop-blur-sm shadow-[0_30px_80px_rgba(16,185,129,0.35)] transition hover:border-emerald-300/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.45em] text-white/60 mb-3">
                      Note Content
                    </p>
                    <p className="text-sm text-white/70 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>
                </div>
              </Card>
              {note.rating && (
                <Card className="group rounded-[28px] border border-amber-400/30 bg-gradient-to-br from-amber-500/30 via-amber-500/15 to-amber-500/5 p-4 backdrop-blur-sm shadow-[0_30px_80px_rgba(245,158,11,0.35)] transition hover:border-amber-300/60">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                        Rating
                      </p>
                      <div className="flex items-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= note.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/60"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              {note.tags && note.tags.length > 0 && (
                <Card className="group rounded-[28px] border border-indigo-400/30 bg-gradient-to-br from-indigo-500/25 via-indigo-500/10 to-indigo-500/5 p-4 backdrop-blur-sm shadow-[0_30px_80px_rgba(99,102,241,0.35)] transition hover:border-indigo-300/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.45em] text-white/60 mb-3">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            className="bg-purple-500/20 backdrop-blur-sm text-purple-300 border-purple-500/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="group rounded-[28px] border border-slate-400/30 bg-gradient-to-br from-slate-500/25 via-slate-500/10 to-slate-500/5 p-8 backdrop-blur-sm shadow-[0_30px_80px_rgba(71,85,105,0.35)] transition hover:border-slate-300/50">
              <div className="text-center">
                <p className="text-white/70">
                  No notes yet. Click edit to add your first note!
                </p>
              </div>
            </Card>
          )}
        </div>
      </CardContent>

      {/* Delete Note Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </Card>
  );
});

RecipeNotes.displayName = "RecipeNotes";

export default RecipeNotes;
