import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { MoreHorizontal, Edit, Trash, History, Calendar } from 'lucide-react';
import { Indicator, Task, TaskDifficulty, TaskStatus } from '@/types/task';
import { TaskHistory } from './task-history';
import { TaskForm } from './task-form';

interface TaskCardProps {
  task: Task;
  indicators: Indicator[]; // <- agregar aquí
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const difficultyColors: Record<TaskDifficulty, string> = {
  slow: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const statusColors: Record<TaskStatus, string> = {
  start: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
};

export function TaskCard({ task, indicators, onUpdate, onDelete }: TaskCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="hover:shadow-md w-full transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="pr-4 truncate">{task.title}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={difficultyColors[task.difficulty]} variant="secondary">
                {task.difficulty}
              </Badge>
              <Badge className={statusColors[task.status]} variant="secondary">
                {task.status}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 w-8 h-8">
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
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm
                    task={task}
                    indicators={indicators} // <- ahora lo pasas
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
      </CardHeader>
      
      <CardContent className="pt-0">
        {task.description && (
          <p className="mb-4 text-muted-foreground break-words">{task.description}</p>
        )}
        
        <div className="space-y-2 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
          
          {task.updatedAt && task.updatedAt.getTime() !== task.createdAt.getTime() && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>Updated: {formatDate(task.updatedAt)}</span>
            </div>
          )}
          
          {task.completedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>Completed: {formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}