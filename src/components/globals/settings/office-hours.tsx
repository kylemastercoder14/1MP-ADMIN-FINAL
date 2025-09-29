"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SettingsData } from "@/types";
import { createOrUpdateOfficeHours } from "@/actions";
import { normalizeToHHMM, formatWorkingHours } from "@/lib/utils";

type OfficeHour = {
  day: string;
  timeStart: string | null;
  timeEnd: string | null;
  isOpen: boolean;
};

const defaultDays: OfficeHour[] = [
  { day: "Monday", timeStart: "08:00", timeEnd: "17:00", isOpen: true },
  { day: "Tuesday", timeStart: "08:00", timeEnd: "17:00", isOpen: true },
  { day: "Wednesday", timeStart: "08:00", timeEnd: "17:00", isOpen: true },
  { day: "Thursday", timeStart: "08:00", timeEnd: "17:00", isOpen: true },
  { day: "Friday", timeStart: "08:00", timeEnd: "17:00", isOpen: true },
  { day: "Saturday", timeStart: "08:00", timeEnd: "13:00", isOpen: true },
  { day: "Sunday", timeStart: "08:00", timeEnd: "13:00", isOpen: false },
];

const OfficeHoursSettings = ({ data }: { data: SettingsData | null }) => {
  const [hours, setHours] = useState<OfficeHour[]>(defaultDays);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔹 Load DB data if available
  useEffect(() => {
    if (data?.officeHours && data.officeHours.length > 0) {
      const dbHours: OfficeHour[] = defaultDays.map((d) => {
        const match = data.officeHours.find((o) => o.day === d.day);
        return match
          ? {
              day: match.day,
              // fallback to default day if DB has null/empty; normalize everything to "HH:mm"
              timeStart: normalizeToHHMM(match.timeStart ?? d.timeStart),
              timeEnd: normalizeToHHMM(match.timeEnd ?? d.timeEnd),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              isOpen: (match as any).isOpen ?? d.isOpen,
            }
          : {
              day: d.day,
              timeStart: normalizeToHHMM(d.timeStart),
              timeEnd: normalizeToHHMM(d.timeEnd),
              isOpen: d.isOpen,
            };
      });
      setHours(dbHours);
    } else {
      // ensure defaults are normalized
      setHours(
        defaultDays.map((d) => ({
          day: d.day,
          timeStart: normalizeToHHMM(d.timeStart),
          timeEnd: normalizeToHHMM(d.timeEnd),
          isOpen: d.isOpen,
        }))
      );
    }
  }, [data]);

  const handleChange = (
    index: number,
    field: "timeStart" | "timeEnd" | "isOpen",
    value: string | boolean
  ) => {
    setHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      for (const item of hours) {
        if (item.isOpen) {
          // Required validation
          if (!item.timeStart || !item.timeEnd) {
            toast.error(`Please set both start and end time for ${item.day}`);
            setLoading(false);
            return;
          }

          // Invalid range validation
          if (item.timeStart >= item.timeEnd) {
            toast.error(
              `Invalid time range for ${item.day}: Start must be before End`
            );
            setLoading(false);
            return;
          }
        }
      }

      const sanitizedHours = hours.map((item) => ({
        day: item.day,
        timeStart: item.timeStart ?? "",
        timeEnd: item.timeEnd ?? "",
        isOpen: item.isOpen,
      }));

      const response = await createOrUpdateOfficeHours(sanitizedHours);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Office hours updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save office hours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Office Hours</h1>
      </div>

      <Card className="rounded-sm">
        <CardHeader>
          <CardTitle>Manage Office Hours</CardTitle>
          <CardDescription>
            Working Hours: {formatWorkingHours(hours)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hours.map((item, index) => (
              <div
                key={item.day}
                className="rounded-sm space-y-3 border p-4 shadow-sm"
              >
                <div>
                  <Label className="font-medium">{item.day}</Label>
                </div>

                <div className="flex items-center gap-6">
                  <div className="lg:w-[45%] space-y-2">
                    <Label>Start</Label>
                    <Input
                      type="time"
                      step="1"
                      value={item.timeStart ?? ""}
                      disabled={!item.isOpen || loading}
                      onChange={(e) =>
                        handleChange(index, "timeStart", e.target.value)
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>
                  <div className="lg:w-[45%] space-y-2">
                    <Label>End</Label>
                    <Input
                      type="time"
                      step="1"
                      value={item.timeEnd ?? ""}
                      disabled={!item.isOpen || loading}
                      onChange={(e) =>
                        handleChange(index, "timeEnd", e.target.value)
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>
                  <div className="lg:[10%] lg:mt-5 flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                      Open
                    </Label>
                    <Switch
                      checked={item.isOpen}
                      disabled={loading}
                      onCheckedChange={(val) =>
                        handleChange(index, "isOpen", val)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              onClick={handleSave}
              disabled={loading}
              variant="primary"
              className="mt-5 ml-auto flex items-center justify-end"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficeHoursSettings;
