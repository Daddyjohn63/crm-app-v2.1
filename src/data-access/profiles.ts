import { database } from '@/db/drizzle';
import { Profile, profiles } from '@/db/schema/index';
import { UserId } from '@/use-cases/types';
import { eq } from 'drizzle-orm';
import {
  uniqueNamesGenerator,
  Config,
  colors,
  animals
} from 'unique-names-generator';

const nameConfig: Config = {
  dictionaries: [colors, animals],
  separator: '',
  style: 'capital',
  length: 2
};

export async function createProfile(
  userId: UserId,
  displayName?: string,
  image?: string
) {
  const defaultName = displayName || uniqueNamesGenerator(nameConfig); // Generate name like "BlueDolphin"
  const [profile] = await database
    .insert(profiles)
    .values({
      userId,
      image,
      displayName: defaultName
    })
    .onConflictDoNothing()
    .returning();
  return profile;
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>
) {
  await database
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId));
}

export async function getProfile(userId: UserId) {
  const profile = await database.query.profiles.findFirst({
    where: eq(profiles.userId, userId)
  });

  return profile;
}
