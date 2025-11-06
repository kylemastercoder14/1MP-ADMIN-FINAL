"use client";

import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface IItem {
  index: number;
  label: string;
  value: "all" | "Pending" | "Approved" | "Rejected";
}

interface TableTabsProps {
  activeTab: IItem["value"];
  setActiveTab: (value: IItem["value"]) => void;
  tabCounts: Record<IItem["value"], number>;
}

const TableTabs = ({
  activeTab,
  setActiveTab,
  tabCounts,
}: TableTabsProps) => {
  const items: IItem[] = [
    {
      index: 0,
      label: "All",
      value: "all",
    },
    {
      index: 1,
      label: "Pending",
      value: "Pending",
    },
    {
      index: 2,
      label: "Approved",
      value: "Approved",
    },
    {
      index: 3,
      label: "Rejected",
      value: "Rejected",
    },
  ];

  return (
    <div className="flex flex-row items-center gap-5 mb-5">
      {items.map((item) => (
        <TabItem
          key={item.index}
          item={item}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          count={tabCounts[item.value]}
        />
      ))}
    </div>
  );
};

const TabItem = ({
  item,
  activeTab,
  setActiveTab,
  count,
}: {
  item: IItem;
  activeTab: IItem["value"];
  setActiveTab: (value: IItem["value"]) => void;
  count: number;
}) => {
  const { label, value } = item;

  const handleClick = () => {
    setActiveTab(value);
  };

  const isActive = useMemo(() => activeTab === value, [activeTab, value]);

  return (
    <>
      {value === "Rejected" && (
        <Separator className="mr-2 h-4 mx-2" orientation="vertical" />
      )}
      <div
        className={cn(
          "flex flex-row gap-2 items-center border-b-2 border-transparent hover:border-primary pb-1 cursor-pointer ",
          {
            "border-primary": isActive,
            "hover:border-primary": isActive,
          }
        )}
        onClick={handleClick}
      >
        <h3
          className={cn("font-normal", {
            "text-primary": isActive,
            "font-bold": isActive,
          })}
        >
          {label}
        </h3>
        <span
          className={cn("bg-gray-200 rounded-xl text-xs px-[6px] font-light", {
            "bg-primary text-white": isActive,
          })}
        >
          {count}
        </span>
      </div>
    </>
  );
};

export default TableTabs;


