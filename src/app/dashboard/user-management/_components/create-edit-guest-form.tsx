import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  boardName: z.string().min(1, { message: 'Board name is required' }),
  permissionLevel: z.enum(['editor', 'viewer'], {
    message: 'Invalid permission level'
  })
});

type FormValues = z.infer<typeof formSchema>;

interface CreateGuestFormProps {
  boards?: { id: number; name: string }[];
}

export function CreateEditGuestForm({ boards = [] }: CreateGuestFormProps) {
  console.log(
    'boards:',
    boards.map(b => b.id)
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      boardName: '',
      permissionLevel: 'viewer'
    }
  });

  const onSubmit = (values: FormValues) => {
    console.log('Guest user form submitted:', values);
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
          name="boardName"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Board</FormLabel>
              <FormControl>
                {/* <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((board, index) => (
                      <SelectItem key={board.id} value={board.name}>
                        {board.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
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
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Create Guest User
        </button>
      </form>
    </Form>
  );
}
