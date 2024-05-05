import { DataTable as SaasDataTable, DataTableProps } from "@saas-ui/react";

export const DataTable = <Data extends object>(props: DataTableProps<Data>) => (
  <SaasDataTable {...props} />
);
