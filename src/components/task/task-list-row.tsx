import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MoreHorizontal, Edit, Trash, History, Calendar, Circle } from 'lucide-react';
import { Task, TaskDifficulty, TaskStatus, Indicator } from '@/types/task';
import { TaskForm } from './task-form';
import { TaskHistory } from './task-history';

interface TaskListRowProps {
  task: Task;
  indicators: Indicator[];
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const difficultyColors: Record<TaskDifficulty, string> = {
  slow: 'Green',
  medium: 'Yellow',
  hard: 'Red',
};

const statusColors: Record<TaskStatus, string> = {
  start: 'Blue',
  pending: 'Yellow',
  progress: 'Lavender',
  failed: 'Red',
  completed: 'Green',
};

const catppuccinColors = [
  { name: 'Green', light: '#40a02b', dark: '#a6e3a1' },
  { name: 'Yellow', light: '#df8e1d', dark: '#f9e2af' },
  { name: 'Red', light: '#d20f39', dark: '#f38ba8' },
  { name: 'Blue', light: '#1e66f5', dark: '#89b4fa' },
  { name: 'Pink', light: '#ea76cb', dark: '#f5c2e7' },
  { name: 'Teal', light: '#179299', dark: '#94e2d5' },
  { name: 'Lavender', light: '#7287fd', dark: '#b4befe' },
  { name: 'Maroon', light: '#e64553', dark: '#eba0ac' },
  { name: 'Peach', light: '#fe640b', dark: '#fab387' },
  { name: 'Sky', light: '#04a5e5', dark: '#89dceb' },
  { name: 'Sapphire', light: '#209fb5', dark: '#74c7ec' },
  { name: 'Rosewater', light: '#dc8a78', dark: '#f5e0dc' },
];

export function TaskListRow({ task, indicators, onUpdate, onDelete }: TaskListRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getColorStyle = (colorName: string) => {
    const color = catppuccinColors.find(c => c.name === colorName);
    if (!color) return {};
    
    return {
      backgroundColor: `light-dark(${color.light}, ${color.dark})`,
      color: 'white',
    };
  };

  const getCategoryIndicator = () => {
    if (!task.categoryId) return null;
    return indicators.find(i => i.id === task.categoryId && i.type === 'category');
  };

  const categoryIndicator = getCategoryIndicator();

  return (
    <div className="group bg-card hover:shadow-md p-4 border rounded-lg transition-all">
      <div className="flex justify-between items-start gap-4">
        {/* Main Content */}
        <div className="flex-1 space-y-3 min-w-0">
          {/* Title and Description */}
          <div>
            <h3 className="pr-4 font-medium truncate">{task.title}</h3>
            {task.description && (
              <p className="mt-1 text-muted-foreground text-sm line-clamp-2">{task.description}</p>
            )}
          </div>

          {/* Indicators Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Importance */}
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3" style={getColorStyle(difficultyColors[task.difficulty])} />
              <Badge
                variant="outline"
                className="text-xs capitalize"
                style={{ borderColor: `light-dark(${catppuccinColors.find(c => c.name === difficultyColors[task.difficulty])?.light}, ${catppuccinColors.find(c => c.name === difficultyColors[task.difficulty])?.dark})` }}
              >
                {task.difficulty}
              </Badge>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1">
              <Circle className="w-3 h-3" style={getColorStyle(statusColors[task.status])} />
              <Badge
                variant="outline"
                className="text-xs capitalize"
                style={{ borderColor: `light-dark(${catppuccinColors.find(c => c.name === statusColors[task.status])?.light}, ${catppuccinColors.find(c => c.name === statusColors[task.status])?.dark})` }}
              >
                {task.status}
              </Badge>
            </div>

            {/* Category */}
            {categoryIndicator && (
              <div className="flex items-center gap-1">
                <Circle className="w-3 h-3" style={getColorStyle(categoryIndicator.color)} />
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: `light-dark(${catppuccinColors.find(c => c.name === categoryIndicator.color)?.light}, ${catppuccinColors.find(c => c.name === categoryIndicator.color)?.dark})` }}
                >
                  {categoryIndicator.name}
                </Badge>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>
            
            {task.updatedAt && task.updatedAt.getTime() !== task.createdAt.getTime() && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Updated: {formatDate(task.updatedAt)}</span>
              </div>
            )}
            
            {task.completedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Completed: {formatDate(task.completedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 p-0 w-8 h-8 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 w-4 h-4" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                  task={task}
                  indicators={indicators}
                  onSubmit={(updatedTask) => {
                    onUpdate(updatedTask);
                    setIsEditOpen(false);
                  }}
                  onCancel={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <History className="mr-2 w-4 h-4" />
                  History
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Task History</DialogTitle>
                </DialogHeader>
                <TaskHistory task={task} />
              </DialogContent>
            </Dialog>
            
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash className="mr-2 w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}