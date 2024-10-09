'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';
import { btnIconStyles, btnStyles } from '@/styles/icons';
//import CreateEditContactForm from './create-edit-contact-form';
import { useServiceOverlayStore } from '@/store/serviceOverlayStore';
import CreateEditServiceForm from './create-edit-service-form';
//import CreateEditContactForm from '../clients/[clientId]/contacts/create-edit-contact-form';

export default function CreateServiceButton() {
  const { setIsOpen, setServiceId } = useServiceOverlayStore();

  const handleCreateContact = () => {
    setIsOpen(true);
  };

  return (
    <>
      <ZustandInteractiveOverlay
        title="Create a Service"
        description="Create a new Services"
        form={<CreateEditServiceForm />}
      />

      <Button onClick={handleCreateContact} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        Create Service
      </Button>
    </>
  );
}
