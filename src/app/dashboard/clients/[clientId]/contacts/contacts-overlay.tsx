'use client';

import CreateEditContactForm from './create-edit-contact-form';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';
import { useOverlayStore } from '@/store/overlayStore';

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
