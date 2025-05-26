'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GuestUserOverlay } from './guest-user-overlay';
import CreateGuestUserButton from './create-guest-user-button';
import { DataTable } from '@/components/data-table';
import { guestUserColumns } from './columns';
import { useGuestUserStore } from '@/store/guestUser';
import { getGuestUsersByBoardId } from '@/use-cases/projects';

interface AddGuestUserProps {
  boardId: number;
  initialGuestUsers?: any[]; // Use a more specific type if available
}

export const AddGuestUser = ({
  boardId,
  initialGuestUsers = []
}: AddGuestUserProps) => {
  const { guestUsers, setGuestUsers } = useGuestUserStore();
  console.log('[AddGuestUser] guestUsers:', guestUsers);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      setGuestUsers(
        initialGuestUsers.map(user => ({
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          role: 'guest' as const,
          permissionLevel: user.permissionLevel as 'editor' | 'viewer'
        }))
      );
      initialized.current = true;
    }
    // eslint-disable-next-line
  }, []); // Only run once on mount

  return (
    <>
      <div className="rounded-lg">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-2xl font-bold mb-4 line-clamp-1">
              Guest Users for this project
            </CardTitle>
            <CreateGuestUserButton />
          </CardHeader>
          <CardContent>
            <DataTable
              columns={guestUserColumns}
              data={guestUsers}
              filterKey="name"
              filterPlaceholder="Filter by Name..."
              // onDelete={async (ids) => { /* implement delete logic here */ }}
            />
          </CardContent>
        </Card>
      </div>
      <GuestUserOverlay />
    </>
  );
};
