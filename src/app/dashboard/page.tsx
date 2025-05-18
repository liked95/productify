"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import { FilterControls } from '@/components/dashboard/FilterControls';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { UserList } from '@/components/dashboard/UserList';
import type { Widget } from '@/lib/types';
import { initialWidgets as defaultInitialWidgets, userActivityWidget } from '@/lib/data'; // Import userActivityWidget
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster'; // Ensure Toaster is available
import { useToast } from '@/hooks/use-toast';
import { AIAssistantPanel } from '@/components/dashboard/AIAssistantPanel';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { cn } from '@/lib/utils';
import { UserActivityChart } from '@/components/dashboard/UserActivityChart';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultInitialWidgets);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [widgetData, setWidgetData] = useState<Widget[]>(defaultInitialWidgets);
  const [userActivityData, setUserActivityData] = useState(userActivityWidget.data);
  const { toast } = useToast();
  const aiOpen = useAIAssistantStore(state => state.open);

  // Load saved layout from localStorage on component mount
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard-widget-order');
    if (savedLayout) {
      try {
        const savedOrder = JSON.parse(savedLayout);
        // Reorder defaultInitialWidgets based on saved order
        const orderedWidgets = savedOrder
          .map((id: string) => defaultInitialWidgets.find(w => w.id === id))
          .filter(Boolean) as Widget[];
        setWidgets(orderedWidgets);
        setWidgetData(orderedWidgets);
      } catch (e) {
        console.error('Error loading saved layout:', e);
      }
    }
  }, []);

  const handleDateChange = useCallback((dateRange: DateRange | undefined) => {
    console.log('Date range selected:', dateRange);
    // Here you would typically refetch data based on the date range
    setActiveFilters(prev => ({ ...prev, dateRange }));
    toast({ title: "Date Range Updated", description: dateRange ? `Showing data from ${dateRange.from?.toLocaleDateString()} to ${dateRange.to?.toLocaleDateString()}` : "Date range cleared." });
  }, [toast]);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    console.log(`Filter applied: ${filterType} = ${value}`);
    // Refetch data based on this filter
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
    toast({ title: "Filter Applied", description: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} set to ${value}.` });
  }, [toast]);

  const handleLayoutChange = useCallback((newLayout: Widget[]) => {
    setWidgets(newLayout);
    setWidgetData(newLayout);
    // Save the new layout order to localStorage
    try {
      localStorage.setItem('dashboard-widget-order', JSON.stringify(newLayout.map(w => w.id)));
      toast({ 
        title: "Layout Saved", 
        description: "Your dashboard layout has been saved.",
        duration: 2000
      });
    } catch (e) {
      console.error('Error saving layout:', e);
      toast({
        title: "Error",
        description: "Failed to save layout. Please try again.",
        variant: "destructive",
        duration: 2000
      });
    }
  }, [toast]);

  // Simulate data generation based on filters
  const generateMockWidgetData = useCallback((filters: Record<string, any>): Widget[] => {
    return widgets.map(widget => {
      let newData = widget.data;
      if (filters.dateRange) {
        if (widget.id === 'tasksCompleted') newData = Math.floor(Math.random() * 50) + 100;
        if (widget.id === 'productivityScore') newData = Math.floor(Math.random() * 20) + 70;
        // No chart data here
      }
      return { ...widget, data: newData };
    });
  }, [widgets]);

  // Generate chart data based on filters
  const generateMockUserActivityData = useCallback((filters: Record<string, any>) => {
    let data = userActivityWidget.data;
    if (filters.dateRange) {
      // Simulate slight variation in chart data
      data = (userActivityWidget.data as {name: string; value: number}[]).map(d => ({
        ...d,
        value: Math.max(0, d.value + Math.floor(Math.random() * 10) - 5)
      }));
    }
    return data;
  }, []);

  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      const newData = generateMockWidgetData(activeFilters);
      setWidgetData(newData);
      setUserActivityData(generateMockUserActivityData(activeFilters));
    }
  }, [activeFilters, generateMockWidgetData, generateMockUserActivityData]);

  return (
    <div className={cn(
      "space-y-8 transition-all duration-300",
      aiOpen && "mr-[376px]"
    )}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Productivity Dashboard</h1>
      
      <FilterControls onDateChange={handleDateChange} onFilterChange={handleFilterChange} />
      
      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">Key Metrics</h2>
        {/* Show all 12 cards in a single DashboardGrid, which handles the grid layout */}
        <DashboardGrid widgetsData={widgetData} onLayoutChange={handleLayoutChange} />
      </div>

      {/* Chart section below cards */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">User Activity</h2>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <UserActivityChart data={userActivityData} />
          </CardContent>
        </Card>
      </section>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">User Performance</h2>
        <UserList />
      </div>

      <AIAssistantPanel />

      <Toaster />
    </div>
  );
}
