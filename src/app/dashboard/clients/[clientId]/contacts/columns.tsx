'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
// import { ContactWithStringId as Contact } from '@/db/schema';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Contacts = {
  id: number;
  last_name: string;
  first_name: string;
  job_title: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
};

export const columns: ColumnDef<Contacts>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },

  {
    accessorKey: 'last_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    }
  },
  {
    accessorKey: 'first_name',
    header: 'First Name'
  },
  {
    accessorKey: 'job_title',
    header: 'Job Title'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Phone'
  },
  {
    accessorKey: 'address',
    header: 'Street'
  },
  {
    accessorKey: 'city',
    header: 'City'
  },
  {
    accessorKey: 'county',
    header: 'County'
  },
  {
    accessorKey: 'postcode',
    header: 'Postcode'
  },
  {
    accessorKey: 'country',
    header: 'Country'
  }
];
