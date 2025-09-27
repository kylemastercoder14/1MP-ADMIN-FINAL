/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, XCircle } from "lucide-react";

type DateRangePickerProps = {
  multiple?: boolean; // single or range selection
  selectedDates?: any; // single date or range
  onSelect: (date: any) => void; // callback when date changes
  onReset?: () => void; // optional reset function
};

export function DateRangePicker({
  multiple = false,
  selectedDates,
  onSelect,
  onReset,
}: DateRangePickerProps) {
  const hasValue = Boolean(selectedDates);

  const getIsDateRange = (dates: any) => {
    return dates && dates.from && dates.to;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLabel = () => {
    if (!hasValue) return "Filter Date Range";

    if (multiple && getIsDateRange(selectedDates)) {
      return `${formatDate(selectedDates.from)} - ${formatDate(selectedDates.to)}`;
    }

    if (!multiple && selectedDates) {
      return formatDate(selectedDates);
    }

    return "Filter Date Range";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-dashed ml-2 flex items-center gap-2">
          {hasValue ? (
            <div
              role="button"
              aria-label="Clear filter"
              tabIndex={0}
              onClick={onReset}
              className="opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {getLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" side='left' align="start">
        {multiple ? (
          <Calendar
            initialFocus
            mode="range"
            selected={
              getIsDateRange(selectedDates)
                ? selectedDates
                : { from: undefined, to: undefined }
            }
            onSelect={onSelect}
            numberOfMonths={2}
          />
        ) : (
          <Calendar
            initialFocus
            mode="single"
            selected={!getIsDateRange(selectedDates) ? selectedDates : undefined}
            onSelect={onSelect}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
