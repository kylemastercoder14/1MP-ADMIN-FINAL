
import React from "react";
import { columns } from "./columns";
import { CampaignProps } from '@/types';
import { CampaignTable } from './campaign-table';

const Client = ({ data }: { data: CampaignProps[] }) => {
  return (
	<div>
	  <CampaignTable columns={columns} data={data} />
	</div>
  );
};

export default Client;
