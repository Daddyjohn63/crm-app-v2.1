'use client';

import { useGuestUserStore } from '@/store/guestUser';

import { GuestInteractiveOverlay } from './guest-interactive-overlay';

//this is the overlay that is used to create or edit a guest user.
//it is used in the guest users page.
//it is a zustand store that is used to store the guest user id.
//it is used to determine if the form is in edit mode or create mode.
//if there is a guest id available, it is assumed to be in edit mode.

export function GuestUserOverlay() {
  const { guestId } = useGuestUserStore();
  const isEditing = !!guestId;

  return (
    <GuestInteractiveOverlay
      title={isEditing ? 'Edit Guest User' : 'Create a Guest User'}
      description={
        isEditing
          ? 'Edit the details of the guest user'
          : 'Create a new guest user for the project'
      }
      form={<div>Guest User Form</div>}
    />
  );
}
