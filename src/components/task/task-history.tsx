import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Calendar, Edit, Plus, RotateCcw, AlertTriangle } from 'lucide-react';
import { Task, TaskHistoryEntry } from '@/types/task';

interface TaskHistoryProps {
  task: Task;
}

export function TaskHistory({ task }: TaskHistoryProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const getActionIcon = (action: TaskHistoryEntry['action']) => {
    switch (action) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'status_changed':
        return <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'difficulty_changed':
        return <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getActionDescription = (entry: TaskHistoryEntry) => {
    switch (entry.action) {
      case 'created':
        return 'Task was created';
      case 'updated':
        return 'Task details were updated';
      case 'status_changed':
        return `Status changed from "${entry.oldValue}" to "${entry.newValue}"`;
      case 'difficulty_changed':
        return `Difficulty changed from "${entry.oldValue}" to "${entry.newValue}"`;
      default:
        return 'Unknown action';
    }
  };

  const getActionColor = (action: TaskHistoryEntry['action']) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'updated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'status_changed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'difficulty_changed':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!task.history || task.history.length === 0) {
    return (
      <div className="flex justify-center items-center py-8 text-muted-foreground">
        <div className="text-center">
          <Calendar className="opacity-50 mx-auto mb-2 w-8 h-8" />
          <p>No history available for this task</p>
        </div>
      </div>
    );
  }

  const sortedHistory = [...task.history].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <ScrollArea className="w-full h-[400px]">
      <div className="space-y-3 pr-4">
        {sortedHistory.map((entry) => (
          <Card key={entry.id} className="border-l-4 border-l-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getActionIcon(entry.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getActionColor(entry.action)} variant="secondary">
                      {entry.action.replace('_', ' ')}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{getActionDescription(entry)}</p>
                  
                  {entry.action === 'updated' && entry.oldValue && entry.newValue && (
                    <div className="space-y-1 mt-2 text-muted-foreground text-xs">
                      {entry.oldValue.title !== entry.newValue.title && (
                        <div>
                          <span className="font-medium">Title:</span> {entry.oldValue.title} → {entry.newValue.title}
                        </div>
                      )}
                      {entry.oldValue.description !== entry.newValue.description && (
                        <div>
                          <span className="font-medium">Description:</span> 
                          <div className="mt-1 pl-2 border-muted border-l-2">
                            {entry.oldValue.description || '(empty)'} → {entry.newValue.description || '(empty)'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}