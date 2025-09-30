import { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, ListTodo } from 'lucide-react';
import { Task, TaskDifficulty, TaskStatus, Indicator } from '@/types/task';
import { TaskForm } from './task-form';
import { TaskListRow } from './task-list-row';
import { TaskFilters } from './task-filters';

interface TaskManagerProps {
  tasks: Task[];
  indicators: Indicator[];
  onTaskCreate: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (id: string) => void;
}

export function TaskManager({ tasks, indicators, onTaskCreate, onTaskUpdate, onTaskDelete }: TaskManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<TaskDifficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'title'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesDifficulty = difficultyFilter === 'all' || task.difficulty === difficultyFilter;
      const matchesCategory = categoryFilter === 'all' || 
        (categoryFilter === 'no-category' && !task.categoryId) ||
        task.categoryId === categoryFilter;

      return matchesSearch && matchesStatus && matchesDifficulty && matchesCategory;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'updated':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'created':
        default:
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [tasks, searchQuery, statusFilter, difficultyFilter, categoryFilter, sortBy, sortOrder]);

  const activeFiltersCount = [
    searchQuery !== '',
    statusFilter !== 'all',
    difficultyFilter !== 'all',
    categoryFilter !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDifficultyFilter('all');
    setCategoryFilter('all');
  };

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  }, [tasks]);

  const categoryIndicators = indicators.filter(i => i.type === 'category');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <ListTodo className="w-6 h-6" />
            Task Manager
          </h1>
          <p className="mt-1 text-muted-foreground">
            Organize and track your tasks efficiently
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              indicators={indicators}
              onSubmit={(task) => {
                onTaskCreate(task);
                setIsCreateOpen(false);
              }}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      {tasks.length > 0 && (
        <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
          <div className="bg-card p-4 border rounded-lg text-center">
            <div className="font-bold text-primary text-2xl">{taskStats.total}</div>
            <div className="text-muted-foreground text-sm">Total Tasks</div>
          </div>
          <div className="bg-card p-4 border rounded-lg text-center">
            <div className="font-bold text-green-600 text-2xl">{taskStats.completed}</div>
            <div className="text-muted-foreground text-sm">Completed</div>
          </div>
          <div className="bg-card p-4 border rounded-lg text-center">
            <div className="font-bold text-purple-600 text-2xl">{taskStats.inProgress}</div>
            <div className="text-muted-foreground text-sm">In Progress</div>
          </div>
          <div className="bg-card p-4 border rounded-lg text-center">
            <div className="font-bold text-yellow-600 text-2xl">{taskStats.pending}</div>
            <div className="text-muted-foreground text-sm">Pending</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {tasks.length > 0 && (
        <TaskFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          difficultyFilter={difficultyFilter}
          onDifficultyFilterChange={setDifficultyFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          categoryIndicators={categoryIndicators}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
        />
      )}

      {/* Task List */}
      {filteredAndSortedTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredAndSortedTasks.map((task) => (
            <TaskListRow
              key={task.id}
              task={task}
              indicators={indicators}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="py-12 text-center">
          <div className="text-muted-foreground">
            <ListTodo className="opacity-50 mx-auto mb-4 w-12 h-12" />
            <h3 className="mb-2 font-medium text-lg">No tasks match your filters</h3>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="text-muted-foreground">
            <ListTodo className="opacity-50 mx-auto mb-4 w-12 h-12" />
            <h3 className="mb-2 font-medium text-lg">No tasks yet</h3>
            <p className="mb-4 text-sm">Create your first task to get started</p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 w-4 h-4" />
                  Create Task
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      )}

      {/* Results count */}
      {tasks.length > 0 && filteredAndSortedTasks.length > 0 && (
        <div className="text-muted-foreground text-sm text-center">
          Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
}