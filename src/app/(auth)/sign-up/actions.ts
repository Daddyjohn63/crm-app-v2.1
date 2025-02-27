'use server';

import { afterLoginUrl } from '@/app-config';
import { rateLimitByIp } from '@/lib/limiter';
import { unauthenticatedAction } from '@/lib/safe-action';
import { setSession } from '@/lib/session';
import { registerUserUseCase } from '@/use-cases/users';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(8)
    })
  )
  .handler(async ({ input }) => {
    try {
      console.log('Starting registration for:', input.email);
      await rateLimitByIp({ key: 'register', limit: 30, window: 30000 });
      console.log('Rate limit check passed');

      const user = await registerUserUseCase(input.email, input.password);
      console.log('User registered:', user);

      await setSession(user.id);
      console.log('Session set');

      return redirect(afterLoginUrl);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  });
