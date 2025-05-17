"use client";

import type { LucideIcon } from 'lucide-react';
import { GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { type CSSProperties } from 'react';
import { UserActivityChart } from './UserActivityChart'; // Import the chart component

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: string; // e.g., "+5.2%"
  changeType?: 'positive' | 'negative';
  className?: string;
  isDragging?: boolean;
  style?: {
    gridColumn?: string;
    gridRow?: string;
  };
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>; // For dnd-kit
  cardType?: 'number' | 'chart'; // New prop to define card type
  chartData?: { name: string; value: number }[]; // Data for chart type
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    { title, value, icon: Icon, change, changeType, className, isDragging, dragHandleProps, cardType = 'number', chartData, ...props },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className={cn(
          'shadow-lg hover:shadow-xl transition-shadow duration-300 relative group',
          isDragging ? 'opacity-50 shadow-2xl ring-2 ring-primary' : '',
          className
        )}
        style={props.style as CSSProperties} // Cast to CSSProperties
        {...props}
      >
        {dragHandleProps && (
          <button 
            {...dragHandleProps} 
            className="absolute top-2 right-2 p-1 text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10 rounded-md hover:bg-accent"
            aria-label={`Drag ${title} widget`}
          >
            <GripVertical className="h-5 w-5" />
          </button>
        )}
        <CardContent className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pr-3 mb-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
          </CardHeader>
          {cardType === 'chart' && chartData ? (
            <UserActivityChart data={chartData} />
          ) : (
            <>
              <div className="text-3xl font-bold text-foreground">{value}</div>
              {change && (
                <p
                  className={cn(
                    'text-xs mt-1',
                    changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                  )}
                >
                  {change}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  }
);

MetricCard.displayName = "MetricCard";
