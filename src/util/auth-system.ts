import { User } from '@/db/schema';
import { PublicError } from '@/use-cases/errors';

// export function assertSystemAllowed(email: string) {
//   if (!allowedUsers.includes(email)) {
//     throw new PublicError('You are not authorized to access this system');
//   }
// }

export function assertSystemLevel(user: User) {
  if (user.role !== 'admin') {
    throw new PublicError('You are not authorized to access this system');
  }
}

export function assertIsGuest(user: User) {
  if (user.role !== 'guest') {
    throw new PublicError('You are not authorized to access this system');
  }
}

export function assertUserLevel(user: User) {}
