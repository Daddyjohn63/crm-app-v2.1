'use client';
//this is the button that opens the overlay to add or remove services from a client.
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
//import CreateEditContactForm from './create-edit-contact-form';
import { useServiceOverlayStore } from '@/store/serviceOverlayStore';
//import CreateEditServiceForm from './create-edit-service-form';
import { useServiceIdParam } from '@/util/safeparam';
import { useClientServiceOverlayStore } from '@/store/clientServiceOverlayStore';
import { ZustandClientToServiceInteractiveOverlay } from './zustand-client-service-interactive-overlay';
import CreateEditServiceForm from '../../services/create-edit-service-form';
import { AddServiceToClientForm } from './add-service-to-client-form';
//import CreateEditContactForm from '../clients/[clientId]/contacts/create-edit-contact-form';

// interface CreateEditServiceButtonProps {
//   serviceId: string | null | undefined;
// }
interface ClientToServiceButtonProps {
  clientId: number;
}

export default function ClientToServiceButton({
  clientId
}: ClientToServiceButtonProps) {
  console.log('CLIENT ID FROM C2S BUTTON', clientId);
  console.log(typeof clientId);
  const { setIsOpen, setClientId } = useClientServiceOverlayStore();

  const handleCreateOrEditService = () => {
    if (clientId) {
      setClientId(clientId);
    } else {
      setClientId(null);
    }
    setIsOpen(true);
  };

  return (
    <>
      <ZustandClientToServiceInteractiveOverlay
        title={clientId ? 'Add Services to Client' : 'Cannot find this client'}
        description={
          clientId ? 'Add or remove any services this client uses' : ''
        }
        form={<AddServiceToClientForm />} //need to change this to the form that adds or removes services from a client.
      />

      <Button onClick={handleCreateOrEditService} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        Edit services
      </Button>
    </>
  );
}
