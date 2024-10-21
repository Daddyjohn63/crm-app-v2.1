'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ZustandInteractiveOverlay } from './zustand-interactive-overlay';
import { btnIconStyles, btnStyles } from '@/styles/icons';
//import CreateEditContactForm from './create-edit-contact-form';
import { useServiceOverlayStore } from '@/store/serviceOverlayStore';
import CreateEditServiceForm from './create-edit-service-form';
import { useServiceIdParam } from '@/util/safeparam';
//import CreateEditContactForm from '../clients/[clientId]/contacts/create-edit-contact-form';

interface CreateEditServiceButtonProps {
  serviceId: string | null | undefined;
}

export default function CreateEditServiceButton({
  serviceId
}: CreateEditServiceButtonProps) {
  //console.log('SERVICE ID FROM  C2S BUTTON', serviceId);
  //console.log(typeof serviceId);
  const { setIsOpen, setServiceId } = useServiceOverlayStore();

  const handleCreateOrEditService = () => {
    if (serviceId) {
      setServiceId(parseInt(serviceId));
    } else {
      setServiceId(null);
    }
    setIsOpen(true);
  };

  return (
    <>
      <ZustandInteractiveOverlay
        title={serviceId ? 'Edit Service' : 'Create a Service'}
        description={
          serviceId ? 'Edit an existing Service' : 'Create a new Service'
        }
        form={<CreateEditServiceForm />}
      />

      <Button onClick={handleCreateOrEditService} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        {serviceId ? 'Edit Service' : 'Create Service'}
      </Button>
    </>
  );
}
