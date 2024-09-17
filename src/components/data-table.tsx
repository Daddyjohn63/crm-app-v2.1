'use client';
import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Row
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash } from 'lucide-react';
import { useServerAction } from 'zsa-react';
import { deleteContactRowAction } from '@/app/dashboard/clients/[clientId]/contacts/actions';
import { UserSession } from '@/use-cases/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  disableDeleteButton?: boolean; //added prop to disable delete button
  clientId: string;
  user: UserSession;
}
interface DataWithId {
  id: string; // or number, depending on your id type
}

export function DataTable<TData extends DataWithId, TValue>({
  columns,
  data,
  filterKey,
  disableDeleteButton = false,
  clientId,
  user
}: DataTableProps<TData, TValue>) {
  console.log('CLIENT ID FROM TABLE', clientId);
  console.log('USER FROM TABLE', user);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDeleteDisabled, setIsDeleteDisabled] =
    React.useState(disableDeleteButton);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  const { execute: deleteRow, isPending } = useServerAction(
    deleteContactRowAction,
    {
      onSuccess() {
        setIsDeleteDisabled(false);
        // Optionally refresh the table data here
      },
      onError() {
        setIsDeleteDisabled(false);
        // Handle error
      }
    }
  );

  const handleDelete = () => {
    setIsDeleteDisabled(true);
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    selectedRows.forEach(row => {
      const rowId = row.original.id;
      deleteRow({ rowId });
    });
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${filterKey}...`}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            className="ml-auto"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleteDisabled || isPending}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
