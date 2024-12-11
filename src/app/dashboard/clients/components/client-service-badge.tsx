import { Badge } from '@/components/ui/badge';
import { Services } from '@/db1/schema';

export function ClientServiceBadge({ service }: { service: Services }) {
  return <Badge>{service.name}</Badge>;
}
