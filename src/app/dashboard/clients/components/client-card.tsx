import { Client } from '@/db/schema';
import { cn } from '@/lib/utils';
import { cardStyles } from '@/styles/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton';

export function ClientCard({
  client,
  buttonText
}: {
  client: Pick<
    Client,
    | 'id'
    | 'business_name'
    | 'primary_email'
    | 'primary_phone'
    | 'business_description'
  >;
  buttonText: string;
}) {
  return (
    <Card className={cn(cardStyles, 'overflow-hidden')}>
      <CardHeader>
        <CardTitle className="truncate">{client.business_name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {client.business_description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="truncate flex items-center">
            <span className="font-semibold mr-1">Email:</span>
            {client.primary_email}
            <CopyToClipboardButton text={client.primary_email} />
          </p>
          <p className="truncate">
            <span className="font-semibold">Phone:</span> {client.primary_phone}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
