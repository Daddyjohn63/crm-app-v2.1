import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGuestUserStore } from '@/store/guestUser';
import { PersonStanding, Terminal } from 'lucide-react';
import { btnIconStyles } from '@/styles/icons';
import { useBoardStore } from '@/store/boardStore';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  permissionLevel: z.enum(['editor', 'viewer'], {
    message: 'Invalid permission level'
  })
});

export function CreateEditGuestForm() {
  const { currentBoardId } = useBoardStore();
  const { guestId } = useGuestUserStore();
  const isEditing = !!guestId;
  const { setIsOpen } = useGuestUserStore();
  const { toast } = useToast();

  return (
    <div>
      <h1>Create Edit Guest Form</h1>
    </div>
  );
}
