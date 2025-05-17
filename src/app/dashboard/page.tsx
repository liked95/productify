"use client";

import React, { useState, useCallback, useEffect } from 'react';
import type { DateRange } from 'react-day-picker';
import { FilterControls } from '@/components/dashboard/FilterControls';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { UserList } from '@/components/dashboard/UserList';
import { LayoutOptimizer } from '@/components/dashboard/LayoutOptimizer';
import type { Widget } from '@/lib/types';
import { initialWidgets as defaultInitialWidgets } from '@/lib/data'; // Renamed to avoid conflict
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/toaster'; // Ensure Toaster is available
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [widgets, setWidgets] = useState<Widget[]>(defaultInitialWidgets);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const { toast } = useToast();

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
    // Potentially save this layout to user preferences/backend
    console.log('Dashboard layout changed:', newLayout.map(w => w.id));
  }, []);
  
  const handleLayoutOptimized = useCallback((optimizedWidgetIds: string[]) => {
    setWidgets(currentWidgets => {
      const newWidgetOrder = [...currentWidgets];
      newWidgetOrder.sort((a, b) => {
        const indexA = optimizedWidgetIds.indexOf(a.id);
        const indexB = optimizedWidgetIds.indexOf(b.id);
        // Widgets not in the optimized list can be appended or handled as needed
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1; // a is not in the list, b is, so b comes first
        if (indexB === -1) return -1; // b is not in the list, a is, so a comes first
        return indexA - indexB;
      });
      return newWidgetOrder;
    });
    console.log('Dashboard layout optimized by AI:', optimizedWidgetIds);
  }, []);


  // Simulate data fetching based on filters.
  // In a real app, this would trigger API calls.
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      console.log("Fetching data with filters:", activeFilters);
      // Potentially update widget data here based on filters
      // For now, just log.
      // Example: setWidgets(prevWidgets => prevWidgets.map(w => ({...w, data: fetchUpdatedData(w.id, activeFilters)})))
    }
  }, [activeFilters]);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Productivity Dashboard</h1>
      
      <FilterControls onDateChange={handleDateChange} onFilterChange={handleFilterChange} />
      
      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">Key Metrics</h2>
        <DashboardGrid widgetsData={widgets} onLayoutChange={handleLayoutChange} />
      </div>

      <Separator />

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-4">User Performance</h2>
        <UserList /> {/* UserList manages its own data fetching/filtering for now */}
      </div>
      
      <Separator />

      <div>
         <LayoutOptimizer currentWidgets={widgets} onLayoutOptimized={handleLayoutOptimized} />
      </div>
      <Toaster /> {/* Ensure Toaster is rendered for notifications */}
    </div>
  );
}
