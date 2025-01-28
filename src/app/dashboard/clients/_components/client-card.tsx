import { Client } from '@/db/schema/index';
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
import { ClipboardCheck, Mail, Phone } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

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
        <CardTitle className="truncate ">{client.business_name}</CardTitle>
        <CardDescription className="line-clamp-2 h-10 text-sm">
          {sanitizeHtml(client.business_description)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm ">
          <p className="truncate flex items-center">
            <span className=" text-muted-foreground mr-1 flex items-center">
              <ClipboardCheck className="w-4 h-4 text-primary mr-2" />
              Sales Stage:
            </span>
            <span className="capitalize">
              {client.sales_stage.replace(/_/g, ' ')}
            </span>
          </p>
          <p className="truncate flex items-center">
            <span className="text-muted-foreground mr-1 flex items-center">
              <Mail className="w-4 h-4 text-primary mr-2" />
              Email:
            </span>
            {client.primary_email}
            <CopyToClipboardButton
              className="text-primary"
              text={client.primary_email}
            />
          </p>
          <p className="truncate flex items-center">
            <span className="text-muted-foreground mr-1 flex items-center">
              <Phone className="w-4 h-4 text-primary mr-2" />
              Phone:
            </span>
            {client.primary_phone}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
