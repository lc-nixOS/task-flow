import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Task, TaskDifficulty, TaskStatus, Indicator } from '@/types/task';

interface TaskFormProps {
  task?: Task;
  indicators: Indicator[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export function TaskForm({ task, indicators, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(task?.difficulty || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'start');
  const [categoryId, setCategoryId] = useState<string>(task?.categoryId || 'no-category');

  const categoryIndicators = indicators.filter(i => i.type === 'category');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const now = new Date();
    const isStatusChange = task && task.status !== status;
    const isDifficultyChange = task && task.difficulty !== difficulty;
    const finalCategoryId = categoryId === 'no-category' ? undefined : categoryId;
    const isCategoryChange = task && task.categoryId !== finalCategoryId;
    
    const newTask: Task = {
      id: task?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      status,
      categoryId: finalCategoryId,
      createdAt: task?.createdAt || now,
      updatedAt: now,
      completedAt: status === 'completed' ? now : (status !== 'completed' ? null : task?.completedAt || null),
      history: [
        ...(task?.history || []),
        ...(!task ? [{
          id: crypto.randomUUID(),
          timestamp: now,
          action: 'created' as const,
        }] : []),
        ...(task && (task.title !== title || task.description !== description) ? [{
          id: crypto.randomUUID(),
          timestamp: now,
          action: 'updated' as const,
          oldValue: { title: task.title, description: task.description },
          newValue: { title, description },
        }] : []),
        ...(isStatusChange ? [{
          id: crypto.randomUUID(),
          timestamp: now,
          action: 'status_changed' as const,
          field: 'status',
          oldValue: task.status,
          newValue: status,
        }] : []),
        ...(isDifficultyChange ? [{
          id: crypto.randomUUID(),
          timestamp: now,
          action: 'difficulty_changed' as const,
          field: 'difficulty',
          oldValue: task.difficulty,
          newValue: difficulty,
        }] : []),
        ...(isCategoryChange ? [{
          id: crypto.randomUUID(),
          timestamp: now,
          action: 'category_changed' as const,
          field: 'category',
          oldValue: task.categoryId,
          newValue: finalCategoryId,
        }] : []),
      ],
    };

    onSubmit(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="difficulty">Importance</Label>
          <Select value={difficulty} onValueChange={(value: TaskDifficulty) => setDifficulty(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(value: TaskStatus) => setStatus(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start">Start</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-category">No category</SelectItem>
              {categoryIndicators.map((indicator) => (
                <SelectItem key={indicator.id} value={indicator.id}>
                  {indicator.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}