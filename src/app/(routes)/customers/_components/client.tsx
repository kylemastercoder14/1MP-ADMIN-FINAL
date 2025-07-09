"use client";

import React from "react";
import { CustomerTable } from "./customer-table";
import { columns } from "./columns";
import { CustomerWithOrder } from "@/types";

const Client = ({ data }: { data: CustomerWithOrder[] }) => {

  return (
	<>
	  <CustomerTable columns={columns} data={data} />
	</>
  );
};

export default Client;
