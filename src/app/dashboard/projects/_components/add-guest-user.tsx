'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateContactButton from '../../clients/[clientId]/contacts/create-contact-button';
import { GuestUserOverlay } from './guest-user-overlay';
import CreateGuestUserButton from './create-guest-user-button';

export const AddGuestUser = () => {
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
            {/* <DataTable
              filterKey="last_name"
              columns={columns}
              data={data}
              disableDeleteButton={false}
              clientId={clientId}
              user={user}
            /> */}
          </CardContent>
        </Card>
      </div>
      <GuestUserOverlay />
    </>
  );
};
