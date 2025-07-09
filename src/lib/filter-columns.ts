/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExtendedColumnFilter, JoinOperator } from "@/types/data-table";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { Prisma } from "@prisma/client";

export function filterColumns<T extends Record<string, any>>({
  table,
  filters,
  joinOperator,
}: {
  table: T;
  filters: ExtendedColumnFilter<T>[];
  joinOperator: JoinOperator;
}): Prisma.ProductWhereInput | undefined {
  const joinFn = joinOperator === "and" ? Prisma.sql`AND` : Prisma.sql`OR`;

  const conditions = filters.map((filter) => {
    const column = filter.id as string;

    switch (filter.operator) {
      case "iLike":
        return filter.variant === "text" && typeof filter.value === "string"
          ? { [column]: { contains: filter.value, mode: "insensitive" } }
          : undefined;

      case "notILike":
        return filter.variant === "text" && typeof filter.value === "string"
          ? {
              NOT: {
                [column]: { contains: filter.value, mode: "insensitive" },
              },
            }
          : undefined;

      case "eq":
        if (
          typeof filter.value === "string" &&
          (filter.value === "true" || filter.value === "false")
        ) {
          return { [column]: filter.value === "true" };
        }
        if (filter.variant === "date" || filter.variant === "dateRange") {
          const date = new Date(Number(filter.value));
          date.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return {
            [column]: {
              gte: date,
              lte: end,
            },
          };
        }
        return { [column]: { equals: filter.value } };

      case "ne":
        if (
          typeof filter.value === "string" &&
          (filter.value === "true" || filter.value === "false")
        ) {
          return { [column]: { not: filter.value === "true" } };
        }
        if (filter.variant === "date" || filter.variant === "dateRange") {
          const date = new Date(Number(filter.value));
          date.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return {
            OR: [{ [column]: { lt: date } }, { [column]: { gt: end } }],
          };
        }
        return { [column]: { not: filter.value } };

      case "inArray":
        if (Array.isArray(filter.value)) {
          return { [column]: { in: filter.value } };
        }
        return undefined;

      case "notInArray":
        if (Array.isArray(filter.value)) {
          return { [column]: { notIn: filter.value } };
        }
        return undefined;

      case "lt":
        return filter.variant === "number" || filter.variant === "range"
          ? { [column]: { lt: filter.value } }
          : filter.variant === "date" && typeof filter.value === "string"
            ? {
                [column]: {
                  lt: new Date(
                    new Date(Number(filter.value)).setHours(23, 59, 59, 999)
                  ),
                },
              }
            : undefined;

      case "lte":
        return filter.variant === "number" || filter.variant === "range"
          ? { [column]: { lte: filter.value } }
          : filter.variant === "date" && typeof filter.value === "string"
            ? {
                [column]: {
                  lte: new Date(
                    new Date(Number(filter.value)).setHours(23, 59, 59, 999)
                  ),
                },
              }
            : undefined;

      case "gt":
        return filter.variant === "number" || filter.variant === "range"
          ? { [column]: { gt: filter.value } }
          : filter.variant === "date" && typeof filter.value === "string"
            ? {
                [column]: {
                  gt: new Date(
                    new Date(Number(filter.value)).setHours(0, 0, 0, 0)
                  ),
                },
              }
            : undefined;

      case "gte":
        return filter.variant === "number" || filter.variant === "range"
          ? { [column]: { gte: filter.value } }
          : filter.variant === "date" && typeof filter.value === "string"
            ? {
                [column]: {
                  gte: new Date(
                    new Date(Number(filter.value)).setHours(0, 0, 0, 0)
                  ),
                },
              }
            : undefined;

      case "isBetween":
        if (
          (filter.variant === "date" || filter.variant === "dateRange") &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          return {
            [column]: {
              ...(filter.value[0]
                ? {
                    gte: new Date(
                      new Date(Number(filter.value[0])).setHours(0, 0, 0, 0)
                    ),
                  }
                : undefined),
              ...(filter.value[1]
                ? {
                    lte: new Date(
                      new Date(Number(filter.value[1])).setHours(
                        23,
                        59,
                        59,
                        999
                      )
                    ),
                  }
                : undefined),
            },
          };
        }

        if (
          (filter.variant === "number" || filter.variant === "range") &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          const firstValue =
            filter.value[0] && filter.value[0].trim() !== ""
              ? Number(filter.value[0])
              : null;
          const secondValue =
            filter.value[1] && filter.value[1].trim() !== ""
              ? Number(filter.value[1])
              : null;

          if (firstValue === null && secondValue === null) {
            return undefined;
          }

          if (firstValue !== null && secondValue === null) {
            return { [column]: { equals: firstValue } };
          }

          if (firstValue === null && secondValue !== null) {
            return { [column]: { equals: secondValue } };
          }

          return {
            [column]: {
              ...(firstValue !== null ? { gte: firstValue } : undefined),
              ...(secondValue !== null ? { lte: secondValue } : undefined),
            },
          };
        }
        return undefined;

      case "isRelativeToToday":
        if (
          (filter.variant === "date" || filter.variant === "dateRange") &&
          typeof filter.value === "string"
        ) {
          const today = new Date();
          const [amount, unit] = filter.value.split(" ") ?? [];
          let startDate: Date;
          let endDate: Date;

          if (!amount || !unit) return undefined;

          switch (unit) {
            case "days":
              startDate = startOfDay(addDays(today, Number.parseInt(amount)));
              endDate = endOfDay(startDate);
              break;
            case "weeks":
              startDate = startOfDay(
                addDays(today, Number.parseInt(amount) * 7)
              );
              endDate = endOfDay(addDays(startDate, 6));
              break;
            case "months":
              startDate = startOfDay(
                addDays(today, Number.parseInt(amount) * 30)
              );
              endDate = endOfDay(addDays(startDate, 29));
              break;
            default:
              return undefined;
          }

          return {
            [column]: {
              gte: startDate,
              lte: endDate,
            },
          };
        }
        return undefined;

      case "isEmpty":
        return { [column]: { equals: null } };

      case "isNotEmpty":
        return { [column]: { not: null } };

      default:
        throw new Error(`Unsupported operator: ${filter.operator}`);
    }
  });

  const validConditions = conditions.filter(
    (condition) => condition !== undefined
  ) as Prisma.ProductWhereInput[];

  if (validConditions.length === 0) {
    return undefined;
  }

  if (validConditions.length === 1) {
    return validConditions[0];
  }

  return {
    [joinOperator === "and" ? "AND" : "OR"]: validConditions,
  };
}
