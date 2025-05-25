import { LoaderButton } from '@/components/loader-button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGuestUserStore } from '@/store/guestUser';
import { PersonStanding, Terminal } from 'lucide-react';
import { btnIconStyles } from '@/styles/icons';
import { useBoardStore } from '@/store/boardStore';
import {
  addGuestUserAction,
  getGuestUsersAction,
  editGuestUserAction
} from '../actions';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  permissionLevel: z.enum(['editor', 'viewer'], {
    message: 'Invalid permission level'
  })
});

type FormValues = z.infer<typeof formSchema>;

export function CreateEditGuestForm() {
  const { currentBoardId } = useBoardStore();
  const { guestId, setIsOpen } = useGuestUserStore();
  const isEditing = !!guestId;
  const { toast } = useToast();

  // Use two separate useServerAction hooks for type safety
  const addAction = useServerAction(addGuestUserAction, {
    onSuccess() {
      toast({
        title: 'Guest User created',
        description: 'The guest user has been created successfully.',
        duration: 3000
      });
      setIsOpen(false);
    },
    onError({ err }) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: 'Something went wrong creating the guest user.',
        duration: 3000
      });
    }
  });

  const editAction = useServerAction(editGuestUserAction, {
    onSuccess() {
      toast({
        title: 'Guest User Updated',
        description: 'The guest user has been updated successfully',
        duration: 3000
      });
      setIsOpen(false);
    },
    onError({ err }) {
      toast({
        title: 'Something went wrong',
        variant: 'destructive',
        description: 'Something went wrong updating the guest user',
        duration: 3000
      });
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      if (isEditing && guestId) {
        // In a real app, fetch guest details here
        // For now, just return empty (or could add fetchGuestUsers logic)
        return {
          name: '',
          email: '',
          permissionLevel: 'viewer'
        };
      }
      return {
        name: '',
        email: '',
        permissionLevel: 'viewer'
      };
    }
  });

  const onSubmit = (values: FormValues) => {
    const safeBoardId = currentBoardId ?? 0;
    if (isEditing) {
      editAction.execute({
        guestId: guestId ?? 0,
        ...values,
        boardId: safeBoardId
      });
    } else {
      addAction.execute({ ...values, boardId: safeBoardId });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 flex-1 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permissionLevel"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Permission Level</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoaderButton
          type="submit"
          isLoading={isEditing ? editAction.isPending : addAction.isPending}
          className="mt-2"
        >
          {isEditing ? 'Update Guest User' : 'Create Guest User'}
        </LoaderButton>
        {(isEditing ? editAction.error : addAction.error) && (
          <div className="text-red-500 text-sm mt-2">
            {(isEditing ? editAction.error : addAction.error)?.message}
          </div>
        )}
      </form>
    </Form>
  );
}
