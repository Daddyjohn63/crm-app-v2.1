import { useSafeParams } from '@/lib/params';
import { z } from 'zod';

export function useClientIdParam() {
  const { clientId } = useSafeParams(
    z.object({ clientId: z.string().pipe(z.coerce.number()) })
  );
  return clientId;
}

export function useServiceIdParam() {
  const { serviceId } = useSafeParams(
    z.object({ serviceId: z.string().pipe(z.coerce.number()) })
  );
  return serviceId;
}

export function useBoardIdParam() {
  const { boardId } = useSafeParams(
    z.object({ boardId: z.string().pipe(z.coerce.number()) })
  );
  return boardId;
}
