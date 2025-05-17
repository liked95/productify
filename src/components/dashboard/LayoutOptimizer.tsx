"use client";

import React, { useState, useTransition } from 'react';
import { optimizeDashboardLayout, OptimizeDashboardLayoutInput, OptimizeDashboardLayoutOutput } from '@/ai/flows/optimize-dashboard-layout';
import type { UserRole, Widget } from '@/lib/types';
import { AVAILABLE_WIDGETS_LIST } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface LayoutOptimizerProps {
  currentWidgets: Widget[];
  onLayoutOptimized: (optimizedWidgetIds: string[]) => void;
}

export function LayoutOptimizer({ currentWidgets, onLayoutOptimized }: LayoutOptimizerProps) {
  const [userRole, setUserRole] = useState<UserRole | ''>('');
  const [selectedWidgetIds, setSelectedWidgetIds] = useState<string[]>(AVAILABLE_WIDGETS_LIST.map(w => w.id));
  const [optimizationResult, setOptimizationResult] = useState<OptimizeDashboardLayoutOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleWidgetSelectionChange = (widgetId: string) => {
    setSelectedWidgetIds(prev => 
      prev.includes(widgetId) ? prev.filter(id => id !== widgetId) : [...prev, widgetId]
    );
  };

  const handleSubmit = async () => {
    if (!userRole) {
      toast({ title: "Error", description: "Please select a user role.", variant: "destructive" });
      return;
    }
    if (selectedWidgetIds.length === 0) {
      toast({ title: "Error", description: "Please select at least one widget.", variant: "destructive" });
      return;
    }

    const input: OptimizeDashboardLayoutInput = {
      userRole: userRole,
      availableWidgets: selectedWidgetIds
        .map(id => AVAILABLE_WIDGETS_LIST.find(w => w.id === id)?.title)
        .filter((title): title is string => Boolean(title)),
    };

    startTransition(async () => {
      try {
        const result = await optimizeDashboardLayout(input);
        setOptimizationResult(result);
        // Map suggested titles back to IDs
        const optimizedIds = result.suggestedLayout
          .map(title => AVAILABLE_WIDGETS_LIST.find(w => w.title === title)?.id)
          .filter((id): id is string => Boolean(id));
        
        onLayoutOptimized(optimizedIds);
        toast({
          title: "Layout Optimized!",
          description: "The AI has suggested a new layout for your dashboard.",
          className: "bg-green-500 text-white dark:bg-green-700",
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      } catch (error) {
        console.error("Error optimizing layout:", error);
        setOptimizationResult(null);
        toast({
          title: "Optimization Failed",
          description: "Could not generate layout. Please try again.",
          variant: "destructive",
          icon: <AlertTriangle className="h-5 w-5" />,
        });
      }
    });
  };

  const userRoles: UserRole[] = ['Manager', 'Individual Contributor', 'Analyst'];

  return (
    <Card className="shadow-md mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          AI Layout Optimizer
        </CardTitle>
        <CardDescription>Let AI suggest an optimal dashboard layout based on user role and selected widgets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="user-role-select" className="text-sm font-medium">User Role</Label>
          <Select value={userRole} onValueChange={(value) => setUserRole(value as UserRole)}>
            <SelectTrigger id="user-role-select" className="w-full mt-1">
              <SelectValue placeholder="Select a user role" />
            </SelectTrigger>
            <SelectContent>
              {userRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Available Widgets for Optimization</Label>
          <ScrollArea className="h-48 rounded-md border p-3">
            <div className="space-y-2">
            {AVAILABLE_WIDGETS_LIST.map(widget => (
              <div key={widget.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`widget-${widget.id}`}
                  checked={selectedWidgetIds.includes(widget.id)}
                  onCheckedChange={() => handleWidgetSelectionChange(widget.id)}
                />
                <Label htmlFor={`widget-${widget.id}`} className="text-sm font-normal cursor-pointer">
                  {widget.title}
                </Label>
              </div>
            ))}
            </div>
          </ScrollArea>
        </div>
        
        {optimizationResult && (
          <div className="mt-4 p-4 bg-accent/20 rounded-md border border-accent">
            <h4 className="font-semibold text-md mb-2 text-primary">AI Suggestion:</h4>
            <p className="text-sm text-foreground"><strong className="font-medium">Reasoning:</strong> {optimizationResult.reasoning}</p>
            <p className="text-sm text-foreground mt-1"><strong className="font-medium">Suggested Order:</strong> {optimizationResult.suggestedLayout.join(', ')}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isPending || !userRole || selectedWidgetIds.length === 0} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Optimize Layout
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
