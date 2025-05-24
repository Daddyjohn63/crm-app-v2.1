'use client';

import CreateEditContactForm from './create-edit-contact-form';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';
import { useOverlayStore } from '@/store/overlayStore';

//this is the overlay that is used to create or edit a contact.
//it is used in the contacts page.
//it is a zustand store that is used to store the contact id.
//it is used to determine if the form is in edit mode or create mode.

export function ContactsOverlay() {
  const { contactId } = useOverlayStore();
  const isEditing = !!contactId;

  return (
    <ZustandInteractiveOverlay
      title={isEditing ? 'Edit Contact' : 'Create a Contact'}
      description={
        isEditing
          ? 'Edit the details of the contact'
          : 'Create a new contact for the client'
      }
      form={<CreateEditContactForm />}
    />
  );
}
