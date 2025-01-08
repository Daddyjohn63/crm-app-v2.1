import { Badge } from '@/components/ui/badge';
import { Services } from '@/db/schema/index';

export function ClientServiceBadge({ service }: { service: Services }) {
  return <Badge>{service.name}</Badge>;
}
