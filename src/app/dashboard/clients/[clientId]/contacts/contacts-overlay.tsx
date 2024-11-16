import CreateEditContactForm from './create-edit-contact-form';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';

export function ContactsOverlay() {
  return (
    <ZustandInteractiveOverlay
      title="Edit Contact"
      description="Edit the details of the contact"
      form={<CreateEditContactForm />}
    />
  );
}
