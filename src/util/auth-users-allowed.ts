import { allowedUsers, bannedUsers } from '@/app-config';
import { PublicError } from '@/use-cases/errors';

export function assertUserAllowed(email: string) {
  // Check if user is banned (unless bannedUsers contains 'none')
  if (!bannedUsers.includes('none') && bannedUsers.includes(email)) {
    throw new PublicError(
      'Your account has been suspended. Please contact support for more information.'
    );
  }

  // If allowedUsers contains 'none', everyone is allowed (except banned users)
  if (allowedUsers.includes('all')) {
    return;
  }

  // If allowedUsers contains 'none', no one is allowed
  if (allowedUsers.includes('none')) {
    throw new PublicError(
      'Access is currently disabled. Please try again later.'
    );
  }

  // Check if email is in allowed list
  if (!allowedUsers.includes(email)) {
    throw new PublicError(
      'Access is currently restricted to invited users only. Please contact support if you believe this is an error.'
    );
  }
}
