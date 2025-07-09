"use client";

import React from "react";
import { ProductTable } from "./product-table";
import { columns } from "./columns";
import { ProductWithProps } from "@/types";

const Client = ({ data }: { data: ProductWithProps[] }) => {
  return (
    <>
      <ProductTable columns={columns} data={data} />
    </>
  );
};

export default Client;
