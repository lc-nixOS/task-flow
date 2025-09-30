'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ListTodo, Palette } from 'lucide-react';
import { Indicator, Task } from '@/types/task';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TaskManager } from '@/components/task/task-manager';
import { IndicatorsModule } from '@/components/indicators-module';
import { ThemeToggle } from '@/components/toogle/toogle-theme';

const TASKS_STORAGE_KEY = 'taskManager_tasks';
const INDICATORS_STORAGE_KEY = 'taskManager_indicators';

// Default indicators for importance and status
const defaultIndicators: Indicator[] = [
  // Importance indicators
  {
    id: 'imp-slow',
    name: 'slow',
    color: 'Green',
    type: 'importance',
    createdAt: new Date(),
  },
  {
    id: 'imp-medium',
    name: 'medium',
    color: 'Yellow',
    type: 'importance',
    createdAt: new Date(),
  },
  {
    id: 'imp-hard',
    name: 'hard',
    color: 'Red',
    type: 'importance',
    createdAt: new Date(),
  },
  // Status indicators
  {
    id: 'status-start',
    name: 'start',
    color: 'Blue',
    type: 'status',
    createdAt: new Date(),
  },
  {
    id: 'status-pending',
    name: 'pending',
    color: 'Yellow',
    type: 'status',
    createdAt: new Date(),
  },
  {
    id: 'status-progress',
    name: 'progress',
    color: 'Lavender',
    type: 'status',
    createdAt: new Date(),
  },
  {
    id: 'status-failed',
    name: 'failed',
    color: 'Red',
    type: 'status',
    createdAt: new Date(),
  },
  {
    id: 'status-completed',
    name: 'completed',
    color: 'Green',
    type: 'status',
    createdAt: new Date(),
  },
];

// Sample tasks for initial data
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch',
    difficulty: 'medium',
    status: 'progress',
    categoryId: undefined,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-16T14:30:00Z'),
    completedAt: null,
    history: [
      {
        id: 'h1',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        action: 'created',
      },
      {
        id: 'h2',
        timestamp: new Date('2024-01-16T14:30:00Z'),
        action: 'status_changed',
        field: 'status',
        oldValue: 'start',
        newValue: 'progress',
      },
    ],
  },
  {
    id: '2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment for the project',
    difficulty: 'hard',
    status: 'completed',
    categoryId: undefined,
    createdAt: new Date('2024-01-10T09:00:00Z'),
    updatedAt: new Date('2024-01-14T16:45:00Z'),
    completedAt: new Date('2024-01-14T16:45:00Z'),
    history: [
      {
        id: 'h3',
        timestamp: new Date('2024-01-10T09:00:00Z'),
        action: 'created',
      },
      {
        id: 'h4',
        timestamp: new Date('2024-01-14T16:45:00Z'),
        action: 'status_changed',
        field: 'status',
        oldValue: 'progress',
        newValue: 'completed',
      },
    ],
  },
  {
    id: '3',
    title: 'Review team feedback',
    description: '',
    difficulty: 'slow',
    status: 'pending',
    categoryId: undefined,
    createdAt: new Date('2024-01-18T11:30:00Z'),
    updatedAt: new Date('2024-01-18T11:30:00Z'),
    completedAt: null,
    history: [
      {
        id: 'h5',
        timestamp: new Date('2024-01-18T11:30:00Z'),
        action: 'created',
      },
    ],
  },
];

export  function TaskApp() {
  const [currentView, setCurrentView] = useState<'tasks' | 'indicators'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>(defaultIndicators);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load tasks
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
          history: task.history.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp),
          })),
        }));
        setTasks(parsedTasks);
      } else {
        // First time user - load sample tasks
        setTasks(sampleTasks);
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(sampleTasks));
      }

      // Load indicators
      const storedIndicators = localStorage.getItem(INDICATORS_STORAGE_KEY);
      if (storedIndicators) {
        const parsedIndicators = JSON.parse(storedIndicators).map((indicator: any) => ({
          ...indicator,
          createdAt: new Date(indicator.createdAt),
        }));
        setIndicators(parsedIndicators);
      } else {
        // First time user - save default indicators
        localStorage.setItem(INDICATORS_STORAGE_KEY, JSON.stringify(defaultIndicators));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      setTasks(sampleTasks);
      setIndicators(defaultIndicators);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (tasks.length > 0) {
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
        toast.error('Failed to save tasks');
      }
    }
  }, [tasks]);

  useEffect(() => {
    if (indicators.length > 0) {
      try {
        localStorage.setItem(INDICATORS_STORAGE_KEY, JSON.stringify(indicators));
      } catch (error) {
        console.error('Failed to save indicators to localStorage:', error);
        toast.error('Failed to save indicators');
      }
    }
  }, [indicators]);

  const handleTaskCreate = (task: Task) => {
    setTasks(prev => [task, ...prev]);
    toast.success('Task created successfully');
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev =>
      prev.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
    toast.success('Task updated successfully');
  };

  const handleTaskDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const handleIndicatorCreate = (indicator: Indicator) => {
    setIndicators(prev => [...prev, indicator]);
    toast.success('Indicator created successfully');
  };

  const handleIndicatorDelete = (id: string) => {
    setIndicators(prev => prev.filter(indicator => indicator.id !== id));
    // Remove the indicator from tasks that use it
    setTasks(prev => prev.map(task => 
      task.categoryId === id ? { ...task, categoryId: undefined } : task
    ));
    toast.success('Indicator deleted successfully');
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 h-14 container">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex justify-center items-center bg-primary rounded-lg w-8 h-8">
                <span className="font-bold text-primary-foreground text-sm">T</span>
              </div>
              <span className="hidden sm:inline-block font-semibold">TaskFlow</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <Button
                variant={currentView === 'tasks' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('tasks')}
                className="gap-2"
              >
                <ListTodo className="w-4 h-4" />
                <span className="hidden sm:inline">Tasks</span>
              </Button>
              <Button
                variant={currentView === 'indicators' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('indicators')}
                className="gap-2"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Indicators</span>
              </Button>
            </nav>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 container">
        {currentView === 'tasks' ? (
          <TaskManager
            tasks={tasks}
            indicators={indicators}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        ) : (
          <IndicatorsModule
            indicators={indicators}
            tasks={tasks}
            onCreateIndicator={handleIndicatorCreate}
            onDeleteIndicator={handleIndicatorDelete}
          />
        )}
      </main>

      {/* Toast notifications */}
      <Toaster richColors position="bottom-right" />
    </div>
  );
}