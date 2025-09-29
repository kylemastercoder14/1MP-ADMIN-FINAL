"use client";

import React from "react";
import { ProductTable } from "./product-table";
import { columns } from "./columns";
import { ColumnDef } from "@tanstack/react-table"; // or wherever ColumnDef is imported from
import { ProductWithProps } from "@/types";
const typedColumns = columns as ColumnDef<ProductWithProps, unknown>[];

const Client = ({ data }: { data: any[] }) => {
  return (
    <>
      <ProductTable columns={typedColumns} data={data} />
    </>
  );
};

export default Client;
