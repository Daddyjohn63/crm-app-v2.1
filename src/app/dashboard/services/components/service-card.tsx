import { Services } from '@/db/schema';
import { cn } from '@/lib/utils';
import { cardStyles } from '@/styles/common';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export function ServiceCard({ service }: { service: Services }) {
  return (
    <Card className={cn(cardStyles, 'overflow-hidden')}>
      <CardHeader>
        <CardTitle className="truncate">{service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="truncate flex  flex-col">
            <span className="font-semibold mr-1 mb-2">Description:</span>
            {service.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
