import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { TaskDifficulty, TaskStatus, Indicator } from '@/types/task';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  difficultyFilter: TaskDifficulty | 'all';
  onDifficultyFilterChange: (difficulty: TaskDifficulty | 'all') => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  categoryIndicators: Indicator[];
  sortBy: 'created' | 'updated' | 'title';
  onSortByChange: (sort: 'created' | 'updated' | 'title') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  difficultyFilter,
  onDifficultyFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryIndicators,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  activeFiltersCount,
  onClearFilters,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4 bg-card p-4 border rounded-lg">
      {/* Search */}
      <div className="relative">
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="top-1/2 right-1 absolute p-0 w-6 h-6 -translate-y-1/2 transform"
            onClick={() => onSearchChange('')}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1">
          <label className="font-medium text-sm">Status</label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="start">Start</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Importance</label>
          <Select value={difficultyFilter} onValueChange={onDifficultyFilterChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Category</label>
          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="no-category">No Category</SelectItem>
              {categoryIndicators.map((indicator) => (
                <SelectItem key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Sort By</label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="updated">Date Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-medium text-sm">Order</label>
          <Select value={sortOrder} onValueChange={onSortOrderChange}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters & Clear */}
      {activeFiltersCount > 0 && (
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="px-2 h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}