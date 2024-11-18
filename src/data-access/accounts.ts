//import { database } from '@/db';
import { accounts } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { and, eq } from 'drizzle-orm';
import crypto from 'crypto';
import { database } from '@/db/drizzle';

const ITERATIONS = 10000;

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      'sha512',
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      }
    );
  });
}

export async function createAccount(userId: UserId, password: string) {
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = await hashPassword(password, salt);
  const [account] = await database
    .insert(accounts)
    .values({
      userId,
      accountType: 'email',
      password: hash,
      salt
    })
    .returning();
  return account;
}

export async function createAccountViaGithub(userId: UserId, githubId: string) {
  await database
    .insert(accounts)
    .values({
      userId: userId,
      accountType: 'github',
      githubId
    })
    .onConflictDoNothing()
    .returning();
}

export async function createAccountViaGoogle(userId: UserId, googleId: string) {
  await database
    .insert(accounts)
    .values({
      userId: userId,
      accountType: 'google',
      googleId
    })
    .onConflictDoNothing()
    .returning();
}
//if I want a user to sign in with their email, I need to get the account associated with their email.

export async function getAccountByUserId(userId: UserId) {
  // const account = await database.query.accounts.findFirst({
  //   where: eq(accounts.userId, userId)
  // });
  const account = await database.query.accounts.findFirst({
    where: and(eq(accounts.userId, userId), eq(accounts.accountType, 'email'))
  });
  return account;
}

export async function updatePassword(
  userId: UserId,
  password: string,
  trx = database
) {
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = await hashPassword(password, salt);
  await trx
    .update(accounts)
    .set({
      password: hash,
      salt
    })
    .where(and(eq(accounts.userId, userId), eq(accounts.accountType, 'email')));
}

export async function getAccountByGoogleId(googleId: string) {
  return await database.query.accounts.findFirst({
    where: eq(accounts.googleId, googleId)
  });
}

export async function getAccountByGithubId(githubId: string) {
  return await database.query.accounts.findFirst({
    where: eq(accounts.githubId, githubId)
  });
}
