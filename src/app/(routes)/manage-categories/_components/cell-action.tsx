"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CellActionProps {
  id: string;
}

export const CellAction: React.FC<CellActionProps> = ({ id }) => {
  const router = useRouter();
  return (
	<>
	  <DropdownMenu>
		<DropdownMenuTrigger className="no-print" asChild>
		  <Button variant="ghost" className="h-8 w-8 p-0">
			<span className="sr-only">Open menu</span>
			<MoreHorizontal className="w-4 h-4" />
		  </Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
		  <DropdownMenuLabel>Actions</DropdownMenuLabel>
		  <DropdownMenuItem onClick={() => router.push(`/manage-categories/${id}`)}>
			<Edit className="w-4 h-4 mr-2" />
			Edit Category
		  </DropdownMenuItem>
		  <DropdownMenuSeparator />
		  {/* TODO: Delete Category */}
		  <DropdownMenuItem onClick={() => {}}>
			<Trash className="w-4 h-4 mr-2" />
			Delete
		  </DropdownMenuItem>
		</DropdownMenuContent>
	  </DropdownMenu>
	</>
  );
};
