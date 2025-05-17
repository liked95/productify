"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon,SlidersHorizontal } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterControlsProps {
  onDateChange: (dateRange: DateRange | undefined) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

export function FilterControls({ onDateChange, onFilterChange }: FilterControlsProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  React.useEffect(() => {
    onDateChange(date);
  }, [date, onDateChange]);

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="date-range" className="text-sm font-medium mb-1 block">Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="project-filter" className="text-sm font-medium mb-1 block">Project</Label>
            <Select onValueChange={(value) => onFilterChange("project", value)}>
              <SelectTrigger id="project-filter" className="w-full">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="projectA">Project Alpha</SelectItem>
                <SelectItem value="projectB">Project Beta</SelectItem>
                <SelectItem value="projectC">Project Gamma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status-filter" className="text-sm font-medium mb-1 block">Status</Label>
             <Select onValueChange={(value) => onFilterChange("status", value)}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Need to import Card components for this to work
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
