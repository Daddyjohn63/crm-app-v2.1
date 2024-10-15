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
        {/* <CardDescription className="line-clamp-2 h-10">
          {service.description}
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="truncate flex items-center">
            <span className="font-semibold mr-1">Description:</span>
            {service.description}
          </p>
          <p className="truncate flex items-center">
            <span className="font-semibold mr-1">Included Services:</span>
            {service.included_services}
          </p>
          <p className="truncate">
            <span className="font-semibold mr-1">Delivery Process:</span>
            {service.delivery_process}
          </p>
          <p className="truncate">
            <span className="font-semibold mr-1">Pricing:</span>
            {service.pricing}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
