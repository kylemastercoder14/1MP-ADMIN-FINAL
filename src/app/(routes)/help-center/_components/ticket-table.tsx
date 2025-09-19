"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { TicketWithProps } from "@/types";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";

interface TicketTableProps<TValue> {
  columns: ColumnDef<TicketWithProps, TValue>[];
  data: TicketWithProps[];
}

export function TicketTable<TValue>({
  columns,
  data,
}: TicketTableProps<TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
	[]
  );
  const [columnVisibility, setColumnVisibility] =
	React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
	data,
	columns,
	getCoreRowModel: getCoreRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	onSortingChange: setSorting,
	getSortedRowModel: getSortedRowModel(),
	onColumnFiltersChange: setColumnFilters,
	getFilteredRowModel: getFilteredRowModel(),
	onColumnVisibilityChange: setColumnVisibility,
	onRowSelectionChange: setRowSelection,
	state: {
	  sorting,
	  columnFilters,
	  columnVisibility,
	  rowSelection,
	},
  });

  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
	const timeout = setTimeout(() => {
	  table.getColumn("ticket")?.setFilterValue(search);
	}, 100);
	return () => clearTimeout(timeout);
  }, [search, table]);

  return (
	<div>
	  <div className="flex items-center py-4">
		<Input
		  placeholder="Search a ticket topic or ID"
		  value={search}
		  onChange={(e) => setSearch(e.target.value)}
		  className="max-w-md rounded-none"
		/>
		{table.getColumn("ticket") && (
		  <DataTableDateFilter
			column={
			  table.getColumn("ticket") as Column<TicketWithProps, unknown>
			}
			multiple
			title="Filter Date Created"
		  />
		)}
		<DataTableViewOptions table={table} />
	  </div>
	  <div className="border mb-5">
		<Table>
		  <TableHeader>
			{table.getHeaderGroups().map((headerGroup) => (
			  <TableRow key={headerGroup.id}>
				{headerGroup.headers.map((header) => {
				  return (
					<TableHead key={header.id}>
					  {header.isPlaceholder
						? null
						: flexRender(
							header.column.columnDef.header,
							header.getContext()
						  )}
					</TableHead>
				  );
				})}
			  </TableRow>
			))}
		  </TableHeader>
		  <TableBody>
			{table.getRowModel().rows?.length ? (
			  table.getRowModel().rows.map((row) => (
				<TableRow
				  key={row.id}
				  data-state={row.getIsSelected() && "selected"}
				>
				  {row.getVisibleCells().map((cell) => (
					<TableCell key={cell.id}>
					  {flexRender(
						cell.column.columnDef.cell,
						cell.getContext()
					  )}
					</TableCell>
				  ))}
				</TableRow>
			  ))
			) : (
			  <TableRow>
				<TableCell
				  colSpan={columns.length}
				  className="h-24 text-center"
				>
				  No results.
				</TableCell>
			  </TableRow>
			)}
		  </TableBody>
		</Table>
	  </div>
	  <DataTablePagination table={table} />
	</div>
  );
}
