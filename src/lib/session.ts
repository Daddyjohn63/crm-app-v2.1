import 'server-only';
import { AuthenticationError } from '@/app/util';
import { createSession, generateSessionToken, validateRequest } from '@/auth';
import { cache } from 'react';
import { UserId } from '@/use-cases/types';
import {
  setSessionTokenCookie,
  deleteSessionTokenCookie,
  getSessionToken
} from './session-token';

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();
  return user ?? undefined;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  //console.log('USER FROM ASSERT AUTHENTICATED', user);
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function setSession(userId: UserId) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  await setSessionTokenCookie(token, session.expiresAt);
}
