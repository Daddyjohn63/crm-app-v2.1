import { useSafeParams } from '@/lib/params';
import { z } from 'zod';

export function useClientIdParam() {
  const { clientId } = useSafeParams(
    z.object({ clientId: z.string().pipe(z.coerce.number()) })
  );
  return clientId;
}
