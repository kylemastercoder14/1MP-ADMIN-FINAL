import React from "react";
import { columns } from "./columns";
import { CategoryTable } from './category-table';
import { CategoryWithProps } from '@/types';

const Client = ({ data }: { data: CategoryWithProps[] }) => {
  return (
    <div>
      <CategoryTable columns={columns} data={data} />
    </div>
  );
};

export default Client;
