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
    | 'sales_stage'
  >;
  buttonText: string;
}) {
  return (
    <Card className={cn(cardStyles, 'overflow-hidden')}>
      <CardHeader>
        <CardTitle className="truncate text-yellow-400">
          {client.business_name}
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          <p className="text-sm">{client.business_description}</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 ">
          <p className="truncate">
            <span className="text-yellow-400">Sales Stage: </span>
            <span className="capitalize">
              {client.sales_stage.replace(/_/g, ' ')}
            </span>
          </p>
          <p className="truncate flex items-center">
            <span className="text-yellow-400 mr-1">Email:</span>
            {client.primary_email}
            <CopyToClipboardButton text={client.primary_email} />
          </p>
          <p className="truncate">
            <span className="text-yellow-400">Phone:</span>{' '}
            {client.primary_phone}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
