import { Profile } from '@/db/schema';
import { getCurrentUser } from '@/lib/session';
import { getProfileImageUrl } from '@/use-cases/users';

export function getProfileImageFullUrl(profile: Profile) {
  return profile.imageId
    ? getProfileImageUrl(profile.userId, profile.imageId)
    : profile.image
    ? profile.image
    : '/profile.png';
}

export async function ProfileImage() {
  return <div>Profile Image</div>;
}
