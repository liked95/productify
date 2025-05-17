"use client";

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSwappingStrategy, // Or rectSortingStrategy, or horizontalListSortingStrategy, etc.
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { Widget } from '@/lib/types';
import { MetricCard } from './MetricCard';

interface SortableWidgetProps {
  widget: Widget;
}

function SortableWidget({ widget }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${widget.colSpan || 1}`,
    gridRow: `span ${widget.rowSpan || 1}`,
    zIndex: isDragging ? 10 : undefined, // Ensure dragging item is on top
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <MetricCard
        cardType={widget.id === 'userActivity' ? 'chart' : 'number'}
        chartData={widget.id === 'userActivity' ? (widget.data as any[]) : undefined}
        id={widget.id}
        title={widget.title}
        value={widget.id !== 'userActivity' ? (widget.data?.toString() ?? 'N/A') : undefined}
        icon={widget.icon}
        /*
        Note: The icon is not currently used in the MetricCard when rendering a chart.
        If you want to display the icon for charts, you'll need to modify MetricCard.tsx
        */
        isDragging={isDragging}
        dragHandleProps={listeners} // Pass listeners to the drag handle in MetricCard
        className="h-full" // Ensure card fills the sortable item div
      />
    </div>
  );
}


interface DashboardGridProps {
  widgetsData?: Widget[]; // Allow passing widgets externally
  onLayoutChange?: (widgets: Widget[]) => void;
}

export function DashboardGrid({ widgetsData, onLayoutChange }: DashboardGridProps) {
  // Using initialWidgets as a fallback if widgetsData is not provided
  const [widgets, setWidgets] = useState<Widget[]>(widgetsData || []);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        if (onLayoutChange) {
          onLayoutChange(newItems);
        }
        return newItems;
      });
    }
  }, [onLayoutChange]);

  const activeWidget = activeId ? widgets.find(w => w.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgets.map(w => w.id)} strategy={rectSwappingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto">
          {widgets.map((widget) => (
            <SortableWidget key={widget.id} widget={widget} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeWidget ? (
          <MetricCard
            id={activeWidget.id}
            title={activeWidget.title}
            cardType={activeWidget.id === 'userActivity' ? 'chart' : 'number'}
            chartData={activeWidget.id === 'userActivity' ? (activeWidget.data as any[]) : undefined}
            value={activeWidget.id !== 'userActivity' ? (activeWidget.data?.toString() ?? 'N/A') : undefined}
            icon={activeWidget.icon}
            isDragging // Visually indicate it's the dragged overlay
            className="shadow-2xl ring-2 ring-primary cursor-grabbing"
            style={{ // Ensure overlay matches item size if colSpan/rowSpan is used
              gridColumn: `span ${activeWidget.colSpan || 1}`,
              gridRow: `span ${activeWidget.rowSpan || 1}`,
            }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
