"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/exercise-card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";
import { mockExercises, categories, levels } from "@/data";
import { FilterOptions } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ExercisesPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    category: "",
    status: "all",
    level: "all",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredExercises = useMemo(() => {
    return mockExercises.filter((exercise) => {
      const matchesSearch =
        exercise.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        exercise.statement.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory =
        !filters.category || exercise.category === filters.category;
      const matchesStatus =
        filters.status === "all" || exercise.status === filters.status;
      const matchesLevel =
        filters.level === "all" || exercise.level === filters.level;

      return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
    });
  }, [filters]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "all",
      level: "all",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "all" && value !== ""
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Browse Exercises
            </h1>
            <p className="text-slate-600 mt-2">
              Discover and solve math exercises from the community
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 glassmorphism shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-lg">
                Filters & Search
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-purple-50 border-purple-200" : ""
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list" ? "bg-purple-50 border-purple-200" : ""
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search exercises by title or content..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span>{filters.category || "All Categories"}</span>
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("category", "")}
                  >
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleFilterChange("category", category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Level Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span className="capitalize">
                      {filters.level === "all" ? "All Levels" : filters.level}
                    </span>
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Difficulty Level</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("level", "all")}
                  >
                    All Levels
                  </DropdownMenuItem>
                  {levels.map((level) => (
                    <DropdownMenuItem
                      key={level}
                      onClick={() => handleFilterChange("level", level)}
                    >
                      <span className="capitalize">{level}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <span className="capitalize">
                      {filters.status === "all" ? "All Status" : filters.status}
                    </span>
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("status", "all")}
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("status", "open")}
                  >
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("status", "pending")}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("status", "finished")}
                  >
                    Finished
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              <Button
                variant="ghost"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing {filteredExercises.length} of {mockExercises.length}{" "}
            exercises
          </p>
        </div>

        {/* Exercise Grid/List */}
        {filteredExercises.length === 0 ? (
          <Card className="glassmorphism shadow-lg">
            <CardContent className="py-12 text-center">
              <div className="text-slate-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No exercises found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your filters or search terms to find what
                you&apos;re looking for.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                className={viewMode === "list" ? "w-full" : ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
