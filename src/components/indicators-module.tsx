import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Palette, Hash, Tag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Indicator, Task } from '@/types/task';

interface IndicatorsModuleProps {
  indicators: Indicator[];
  tasks: Task[];
  onCreateIndicator: (indicator: Indicator) => void;
  onDeleteIndicator: (id: string) => void;
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function IndicatorsModule({ indicators, tasks, onCreateIndicator, onDeleteIndicator }: IndicatorsModuleProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newIndicatorName, setNewIndicatorName] = useState('');
  const [newIndicatorType, setNewIndicatorType] = useState<'importance' | 'status' | 'category'>('category');
  const [newIndicatorColor, setNewIndicatorColor] = useState(catppuccinColors[0]);

  const getIndicatorIcon = (type: Indicator['type']) => {
    switch (type) {
      case 'importance':
        return <AlertTriangle className="w-4 h-4" />;
      case 'status':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'category':
        return <Tag className="w-4 h-4" />;
    }
  };

  const getTaskCount = (indicatorId: string, type: Indicator['type']) => {
    switch (type) {
      case 'category':
        return tasks.filter(task => task.categoryId === indicatorId).length;
      case 'importance':
        const indicator = indicators.find(i => i.id === indicatorId);
        return tasks.filter(task => task.difficulty === indicator?.name.toLowerCase()).length;
      case 'status':
        const statusIndicator = indicators.find(i => i.id === indicatorId);
        return tasks.filter(task => task.status === statusIndicator?.name.toLowerCase()).length;
      default:
        return 0;
    }
  };

  const groupedIndicators = indicators.reduce((groups, indicator) => {
    if (!groups[indicator.type]) {
      groups[indicator.type] = [];
    }
    groups[indicator.type].push(indicator);
    return groups;
  }, {} as Record<Indicator['type'], Indicator[]>);

  const handleCreateIndicator = () => {
    if (!newIndicatorName.trim()) return;

    const newIndicator: Indicator = {
      id: crypto.randomUUID(),
      name: newIndicatorName.trim(),
      color: newIndicatorColor.name,
      type: newIndicatorType,
      createdAt: new Date(),
    };

    onCreateIndicator(newIndicator);
    setNewIndicatorName('');
    setNewIndicatorColor(catppuccinColors[0]);
    setIsCreateOpen(false);
  };

  const getColorStyle = (colorName: string) => {
    const color = catppuccinColors.find(c => c.name === colorName);
    if (!color) return {};
    
    return {
      backgroundColor: `light-dark(${color.light}, ${color.dark})`,
      color: 'white',
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <Palette className="w-6 h-6" />
            Indicators Manager
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage task indicators and their colors
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Indicator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Indicator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newIndicatorName}
                  onChange={(e) => setNewIndicatorName(e.target.value)}
                  placeholder="Enter indicator name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={newIndicatorType} onValueChange={(value: 'importance' | 'status' | 'category') => setNewIndicatorType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="importance">Importance</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="gap-2 grid grid-cols-4">
                  {catppuccinColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setNewIndicatorColor(color)}
                      className="flex justify-center items-center border-2 rounded-md w-full h-10 transition-all"
                      style={{
                        backgroundColor: `light-dark(${color.light}, ${color.dark})`,
                        borderColor: newIndicatorColor.name === color.name ? 'currentColor' : 'transparent',
                      }}
                      title={color.name}
                    >
                      {newIndicatorColor.name === color.name && (
                        <span className="font-medium text-white text-xs">{color.name.charAt(0)}</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">Selected: {newIndicatorColor.name}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateIndicator} className="flex-1">
                  Create Indicator
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Indicators by Type */}
      <div className="space-y-6">
        {(['importance', 'status', 'category'] as const).map((type) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 capitalize">
                {getIndicatorIcon(type)}
                {type} Indicators
                <Badge variant="secondary" className="ml-auto">
                  {groupedIndicators[type]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {groupedIndicators[type]?.length > 0 ? (
                <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedIndicators[type].map((indicator) => (
                    <div
                      key={indicator.id}
                      className="flex justify-between items-center bg-muted/30 p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="border rounded-full w-4 h-4"
                          style={getColorStyle(indicator.color)}
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{indicator.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {getTaskCount(indicator.id, type)} tasks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="secondary"
                          style={getColorStyle(indicator.color)}
                          className="text-xs"
                        >
                          <Hash className="mr-1 w-2 h-2" />
                          {getTaskCount(indicator.id, type)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-muted-foreground text-center">
                  <div className="space-y-2">
                    {getIndicatorIcon(type)}
                    <p>No {type} indicators yet</p>
                    <p className="text-sm">Create your first {type} indicator to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-bold text-primary text-2xl">{indicators.length}</div>
              <div className="text-muted-foreground text-sm">Total Indicators</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-bold text-green-600 text-2xl">{groupedIndicators.category?.length || 0}</div>
              <div className="text-muted-foreground text-sm">Categories</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-bold text-yellow-600 text-2xl">{groupedIndicators.importance?.length || 0}</div>
              <div className="text-muted-foreground text-sm">Importance</div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <div className="font-bold text-blue-600 text-2xl">{groupedIndicators.status?.length || 0}</div>
              <div className="text-muted-foreground text-sm">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}