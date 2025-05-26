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
import { toast } from './ui/use-toast';
import { UserSession } from '@/use-cases/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  filterPlaceholder?: string;
  disableDeleteButton?: boolean;
  clientId?: string;
  user?: UserSession;
  onDelete?: (selectedIds: number[]) => Promise<void>;
}
interface DataWithId {
  id: number;
}

export function DataTable<TData extends DataWithId, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder = 'Filter...',
  disableDeleteButton = false,
  clientId,
  user,
  onDelete
}: DataTableProps<TData, TValue>) {
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

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleteDisabled(true);
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(row => row.original.id);
    try {
      await onDelete(selectedIds);
      toast({
        title: 'Items deleted',
        description: 'The selected items have been deleted'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the items'
      });
    } finally {
      setIsDeleteDisabled(false);
    }
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={filterPlaceholder}
          value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn(filterKey)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {onDelete && table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            className="ml-auto"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleteDisabled}
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
