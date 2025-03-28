import {
  MAX_UPLOAD_IMAGE_SIZE,
  MAX_UPLOAD_IMAGE_SIZE_IN_MB,
  applicationName
} from '@/app-config';
import {
  createUser,
  deleteUser,
  getUserByEmail,
  updateUser,
  verifyPassword
} from '@/data-access/users';
import { UserId, UserSession } from '@/use-cases/types';
import { createUUID } from '@/util/uuid';
//import { getFileUrl, uploadFileToBucket } from '@/lib/files';
import { env } from '@/env';
import {
  createAccount,
  createAccountViaGithub,
  createAccountViaGoogle,
  updatePassword
} from '@/data-access/accounts';
import {
  uniqueNamesGenerator,
  Config,
  colors,
  animals
} from 'unique-names-generator';
import {
  createProfile,
  getProfile,
  updateProfile
} from '@/data-access/profiles';
import { GoogleUser } from '@/app/api/login/google/callback/route';
import { GitHubUser } from '@/app/api/login/github/callback/route';
import { sendEmail } from '@/lib/send-email';
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetToken
} from '@/data-access/reset-tokens';
import { ResetPasswordEmail } from '@/emails/reset-password';
import {
  createVerifyEmailToken,
  deleteVerifyEmailToken,
  getVerifyEmailToken
} from '@/data-access/verify-email';
import { VerifyEmail } from '@/emails/verify-email';
import {
  getNotificationsForUser,
  getTop3UnreadNotificationsForUser
} from '@/data-access/notifications';
import { createTransaction } from '@/data-access/utils';
import { LoginError, PublicError } from './errors';
import { deleteSessionForUser } from '@/data-access/sessions';
import { getFileUrl, uploadFileToBucket } from '@/lib/files';
import { assertUserAllowed } from '@/util/auth-users-allowed';

export async function deleteUserUseCase(
  authenticatedUser: UserSession,
  userToDeleteId: UserId
): Promise<void> {
  if (authenticatedUser.id !== userToDeleteId) {
    throw new PublicError('You can only delete your own account');
  }

  await deleteUser(userToDeleteId);
}

export async function getUserProfileUseCase(userId: UserId) {
  const profile = await getProfile(userId);

  if (!profile) {
    throw new PublicError('User not found');
  }

  return profile;
}

export async function registerUserUseCase(email: string, password: string) {
  try {
    console.log('Checking if user is allowed:', email);
    assertUserAllowed(email);

    console.log('Checking for existing user');
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new PublicError('An user with that email already exists.');
    }

    console.log('Creating user');
    const user = await createUser(email);
    console.log('Creating account');
    await createAccount(user.id, password);

    const displayName = uniqueNamesGenerator({
      dictionaries: [colors, animals],
      separator: ' ',
      style: 'capital'
    });
    console.log('Creating profile:', displayName);
    await createProfile(user.id, displayName);

    console.log('Creating verification token');
    const token = await createVerifyEmailToken(user.id);

    console.log('Sending verification email');
    await sendEmail(
      email,
      `Verify your email for ${applicationName}`,
      <VerifyEmail token={token} />
    );

    return { id: user.id };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function signInUseCase(email: string, password: string) {
  assertUserAllowed(email);
  const user = await getUserByEmail(email);
  //console.log('user', user); //correct, finds the right user id

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  return { id: user.id };
}

export function getProfileImageKey(userId: UserId, imageId: string) {
  return `users/${userId}/images/${imageId}`;
}

export async function updateProfileImageUseCase(file: File, userId: UserId) {
  if (!file.type.startsWith('image/')) {
    throw new PublicError('File should be an image.');
  }

  if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_IMAGE_SIZE_IN_MB}MB.`
    );
  }

  const imageId = createUUID();

  await uploadFileToBucket(file, getProfileImageKey(userId, imageId));
  await updateProfile(userId, { imageId });
}

export function getProfileImageUrl(userId: UserId, imageId: string) {
  return `${env.HOST_NAME}/api/users/${userId}/images/${imageId ?? 'default'}`;
}

export function getDefaultImage(userId: UserId) {
  return `${env.HOST_NAME}/api/users/${userId}/images/default`;
}

export async function getProfileImageUrlUseCase({
  userId,
  imageId
}: {
  userId: UserId;
  imageId: string;
}) {
  const url = await getFileUrl({
    key: getProfileImageKey(userId, imageId)
  });

  return url;
}

export async function updateProfileBioUseCase(userId: UserId, bio: string) {
  await updateProfile(userId, { bio });
}

export async function updateProfileNameUseCase(
  userId: UserId,
  displayName: string
) {
  await updateProfile(userId, { displayName });
}

export async function createGithubUserUseCase(githubUser: GitHubUser) {
  let existingUser = await getUserByEmail(githubUser.email);

  if (!existingUser) {
    existingUser = await createUser(githubUser.email);
  }

  await createAccountViaGithub(existingUser.id, githubUser.id);

  await createProfile(existingUser.id, githubUser.login, githubUser.avatar_url);

  return existingUser.id;
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
  let existingUser = await getUserByEmail(googleUser.email);
  //console.log('existingUser', existingUser);

  if (!existingUser) {
    existingUser = await createUser(googleUser.email);
  }

  await createAccountViaGoogle(existingUser.id, googleUser.sub);

  await createProfile(existingUser.id, googleUser.name, googleUser.picture);

  return existingUser.id;
}

export async function resetPasswordUseCase(email: string) {
  assertUserAllowed(email);
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const token = await createPasswordResetToken(user.id);

  await sendEmail(
    email,
    `Your password reset link for ${applicationName}`,
    <ResetPasswordEmail token={token} />
  );
}

export async function changePasswordUseCase(token: string, password: string) {
  const tokenEntry = await getPasswordResetToken(token);

  if (!tokenEntry) {
    throw new PublicError('Invalid token');
  }

  const userId = tokenEntry.userId;

  await createTransaction(async trx => {
    await deletePasswordResetToken(token, trx);
    await updatePassword(userId, password, trx);
    await deleteSessionForUser(userId, trx);
  });
}

// export async function changePasswordUseCase(token: string, password: string) {
//   const tokenEntry = await getPasswordResetToken(token);

//   if (!tokenEntry) {
//     throw new PublicError('Invalid token');
//   }

//   const userId = tokenEntry.userId;

//   await deletePasswordResetToken(token);
//   await updatePassword(userId, password);
//   await deleteSessionForUser(userId);
// }

export async function verifyEmailUseCase(token: string) {
  const tokenEntry = await getVerifyEmailToken(token);

  if (!tokenEntry) {
    throw new PublicError('Invalid token');
  }

  const userId = tokenEntry.userId;

  await updateUser(userId, { emailVerified: new Date() });
  await deleteVerifyEmailToken(token);
  return userId;
}

export async function getUnreadNotificationsForUserUseCase(userId: UserId) {
  return await getTop3UnreadNotificationsForUser(userId);
}

export async function getNotificationsForUserUseCase(userId: UserId) {
  const notifications = await getNotificationsForUser(userId);
  notifications.sort((a, b) => b.createdOn.getTime() - a.createdOn.getTime());
  return notifications;
}
