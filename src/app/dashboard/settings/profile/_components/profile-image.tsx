import { Profile } from '@/db/schema/index';
import { ProfileImageForm } from './profile-image-form';
import { getCurrentUser } from '@/lib/session';
import {
  getProfileImageUrl,
  getProfileImageUrlUseCase
} from '@/use-cases/users';
import Image from 'next/image';
import { ConfigurationPanel } from '@/components/configuration-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { getUserProfileLoader } from '../page';
//import { getUserProfileLoader } from './page';

export async function getProfileImageFullUrl(profile: Profile) {
  if (profile.imageId) {
    return await getProfileImageUrlUseCase({
      userId: profile.userId,
      imageId: profile.imageId
    });
  }
  return profile.image ?? '/profile.png';
}

export async function ProfileImage() {
  return (
    <ConfigurationPanel title="Profile Image">
      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded" />}>
        <ProfileImageContent />
      </Suspense>
    </ConfigurationPanel>
  );
}

async function ProfileImageContent() {
  const user = await getCurrentUser();
  //console.log('user from profile image', user);

  if (!user) {
    return null;
  }

  const profile = await getUserProfileLoader(user.id);
  const imageUrl = await getProfileImageFullUrl(profile);

  return (
    <div className="flex flex-col sm:items-center">
      <Image
        src={imageUrl}
        width={200}
        height={200}
        className="h-[200px] sm:h-[200px] w-full object-cover rounded-xl mb-4 sm:mb-6"
        alt="Profile image"
      />
      <ProfileImageForm />
    </div>
  );
}
