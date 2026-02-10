"use client";

import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  UtensilsCrossed,
  Wine,
  FolderOpen,
  CalendarDays,
  FileText,
  Server,
} from "lucide-react";
import { AuthProvider } from "../../context/AuthContext";
import { RecipeProvider } from "../../context/RecipeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

type EndpointDoc = {
  method: string;
  path: string;
  description: string;
  params?: string;
};

/** Lucide icon per API docs category - icon only on phone, text on sm+ */
const API_DOCS_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Recipes: UtensilsCrossed,
  "Food & Wine": Wine,
  Collections: FolderOpen,
  "Meal & Shopping": CalendarDays,
  CMS: FileText,
  Platform: Server,
};

const API_DOCS: Record<string, EndpointDoc[]> = {
  Recipes: [
    {
      method: "GET",
      path: "/api/recipes/search",
      description: "Search recipes",
      params: "searchTerm, page, cuisine, diet, type",
    },
    {
      method: "GET",
      path: "/api/recipes/autocomplete",
      description: "Autocomplete recipe search",
      params: "query, number",
    },
    {
      method: "GET",
      path: "/api/recipes/[id]/information",
      description: "Get recipe details",
      params: "id",
    },
    {
      method: "GET",
      path: "/api/recipes/[id]/summary",
      description: "Get recipe summary",
      params: "id",
    },
    {
      method: "GET",
      path: "/api/recipes/[id]/similar",
      description: "Get similar recipes",
      params: "id",
    },
    {
      method: "GET",
      path: "/api/recipes/favourite",
      description: "List favourites",
      params: "auth",
    },
    {
      method: "POST",
      path: "/api/recipes/favourite",
      description: "Add favourite",
      params: "recipeId",
    },
    {
      method: "DELETE",
      path: "/api/recipes/favourite",
      description: "Remove favourite",
      params: "recipeId",
    },
    {
      method: "GET",
      path: "/api/recipes/images",
      description: "Get recipe images",
      params: "recipeId",
    },
    {
      method: "GET",
      path: "/api/recipes/notes",
      description: "Get recipe notes",
      params: "recipeId",
    },
    {
      method: "GET",
      path: "/api/recipes/videos",
      description: "Get recipe videos",
      params: "recipeId",
    },
  ],
  "Food & Wine": [
    {
      method: "GET",
      path: "/api/food/wine/dishes",
      description: "Dish pairing for wine",
      params: "wine",
    },
    {
      method: "GET",
      path: "/api/food/wine/pairing",
      description: "Wine pairing for food",
      params: "food, maxPrice",
    },
  ],
  Collections: [
    {
      method: "GET",
      path: "/api/collections",
      description: "List collections",
      params: "auth",
    },
    {
      method: "GET",
      path: "/api/collections/[id]",
      description: "Get collection",
      params: "id",
    },
    {
      method: "GET",
      path: "/api/collections/[id]/items",
      description: "List collection items",
      params: "id",
    },
    {
      method: "GET",
      path: "/api/collections/[id]/recipes",
      description: "Collection items with recipe details",
      params: "id",
    },
    {
      method: "POST",
      path: "/api/collections",
      description: "Create collection",
      params: "name",
    },
    {
      method: "POST",
      path: "/api/collections/[id]/items",
      description: "Add item to collection",
      params: "recipeId",
    },
    {
      method: "PUT",
      path: "/api/collections/[id]",
      description: "Update collection",
      params: "name",
    },
    {
      method: "DELETE",
      path: "/api/collections/[id]",
      description: "Delete collection",
      params: "id",
    },
    {
      method: "DELETE",
      path: "/api/collections/[id]/items",
      description: "Remove item",
      params: "recipeId",
    },
  ],
  "Meal & Shopping": [
    {
      method: "GET",
      path: "/api/meal-plan",
      description: "Get meal plan",
      params: "auth",
    },
    {
      method: "POST",
      path: "/api/meal-plan",
      description: "Add to meal plan",
      params: "recipeId, date, slot",
    },
    {
      method: "DELETE",
      path: "/api/meal-plan",
      description: "Remove from meal plan",
      params: "auth",
    },
    {
      method: "GET",
      path: "/api/shopping-list",
      description: "Get shopping list",
      params: "auth",
    },
    {
      method: "POST",
      path: "/api/shopping-list",
      description: "Add to shopping list",
      params: "items",
    },
    {
      method: "PUT",
      path: "/api/shopping-list",
      description: "Update shopping list",
      params: "items",
    },
    {
      method: "DELETE",
      path: "/api/shopping-list",
      description: "Clear shopping list",
      params: "auth",
    },
  ],
  CMS: [
    {
      method: "GET",
      path: "/api/cms/blog",
      description: "List blog posts",
      params: "",
    },
    {
      method: "GET",
      path: "/api/cms/blog/[slug]",
      description: "Get blog post",
      params: "slug",
    },
  ],
  Platform: [
    {
      method: "GET",
      path: "/api/business-insights",
      description: "Platform statistics",
      params: "",
    },
    {
      method: "GET",
      path: "/api/status",
      description: "API health status",
      params: "",
    },
  ],
};

const ApiDocsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-14 w-14 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
    </div>
    <Skeleton className="h-10 w-full max-w-2xl rounded-md" />
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card
          key={i}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-500/30 backdrop-blur-md"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-4 flex-1 max-w-[280px]" />
                </div>
                <Skeleton className="h-3 w-full max-w-[400px]" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ApiDocsContent = memo(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <ApiDocsSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header - icon + title inline, description below (home page style) */}
      <div className="min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl flex-shrink-0 flex items-center">
            <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-violet-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white break-words">
            API Documentation
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Endpoint reference grouped by category
        </p>
      </div>

      <Tabs defaultValue="Recipes" className="w-full">
        <TabsList className="bg-slate-800/80 border border-slate-500/30 text-gray-300 h-10 p-1 gap-1 flex-wrap min-w-0 w-full">
          {Object.keys(API_DOCS).map((cat) => {
            const Icon = API_DOCS_ICONS[cat];
            return (
              <TabsTrigger
                key={cat}
                value={cat}
                title={cat}
                className="flex flex-1 items-center justify-center gap-2 data-[state=active]:bg-purple-500/30 data-[state=active]:text-white data-[state=active]:border-purple-500/50 px-2 sm:px-3"
              >
                {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                <span className="hidden sm:inline">{cat}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {Object.entries(API_DOCS).map(([cat, endpoints]) => (
          <TabsContent key={cat} value={cat} className="mt-4 space-y-4">
            {endpoints.map((ep, i) => (
              <Card
                key={i}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-500/30 backdrop-blur-md"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={
                            ep.method === "GET"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : ep.method === "POST"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : ep.method === "PUT"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                          }
                        >
                          {ep.method}
                        </Badge>
                        <code className="text-sm text-gray-300 font-mono truncate">
                          {ep.path}
                        </code>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        {ep.description}
                      </p>
                      {ep.params && (
                        <p className="text-xs text-gray-500 mt-1">
                          Params: {ep.params}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
});

ApiDocsContent.displayName = "ApiDocsContent";

function ApiDocsPageClient() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <div
          className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col"
          style={{
            backgroundImage: "url(/recipe-bg-4.avif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <Navbar />
          <main className="flex-1 max-w-9xl mx-auto px-2 sm:px-4 md:px-6 xl:px-8 py-8 w-full">
            <ApiDocsContent />
          </main>
          <Footer />
        </div>
      </RecipeProvider>
    </AuthProvider>
  );
}

export default ApiDocsPageClient;
