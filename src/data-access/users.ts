import { database } from '@/db/drizzle';
import { accounts, users, type User } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { UserId } from '@/use-cases/types';
import { getAccountByUserId } from '@/data-access/accounts';

const ITERATIONS = 10000;

export async function deleteUser(userId: UserId) {
  await database.delete(users).where(eq(users.id, userId));
}

export async function getUser(userId: UserId) {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId)
  });

  return user;
}

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

export async function createUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email
    })
    .returning();
  return user;
}

export async function createMagicUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
      emailVerified: new Date()
    })
    .returning();

  await database
    .insert(accounts)
    .values({
      userId: user.id,
      accountType: 'email'
    })
    .returning();

  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);
  console.log('user from data access', user); //correct, finds the right user id

  if (!user) {
    console.log('No user found for email:', email);
    return false;
  }

  const account = await getAccountByUserId(user.id);
  console.log('account from data access', account); //correct, finds the incorrect account. There are 2 accounts for this user, one for their email and one for Google Auth.

  if (!account) {
    console.log('No account found for user:', user.id);
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    console.log('Missing salt or password for account:', account.id);
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  const matches = account.password === hash;
  console.log('Password verification result:', matches);
  return matches;
}

// export async function verifyPassword(email: string, plainTextPassword: string) {
//   const user = await getUserByEmail(email);

//   if (!user) {
//     return false;
//   }

//   const account = await getAccountByUserId(user.id);

//   if (!account) {
//     return false;
//   }

//   const salt = account.salt;
//   const savedPassword = account.password;

//   if (!salt || !savedPassword) {
//     return false;
//   }

//   const hash = await hashPassword(plainTextPassword, salt);
//   return account.password == hash;
// }

export async function getUserByEmail(email: string) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email)
  });

  return user;
}

export async function getMagicUserAccountByEmail(email: string) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email)
  });

  return user;
}

export async function setEmailVerified(userId: UserId) {
  await database
    .update(users)
    .set({
      emailVerified: new Date()
    })
    .where(eq(users.id, userId));
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  await database.update(users).set(updatedUser).where(eq(users.id, userId));
}
