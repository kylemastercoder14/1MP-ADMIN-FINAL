import React from "react";
import { columns } from "./columns";
import { TicketTable } from './ticket-table';
import { TicketWithProps } from '@/types';

const Client = ({ data }: { data: TicketWithProps[] }) => {
  return (
	<div>
	  <TicketTable columns={columns} data={data} />
	</div>
  );
};

export default Client;
