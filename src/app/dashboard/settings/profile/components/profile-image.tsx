import { Profile } from '@/db/schema/index';
import { ProfileImageForm } from './profile-image-form';
import { getCurrentUser } from '@/lib/session';
import { getProfileImageUrl } from '@/use-cases/users';
import Image from 'next/image';
import { ConfigurationPanel } from '@/components/configuration-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { getUserProfileLoader } from '../page';
//import { getUserProfileLoader } from './page';

export function getProfileImageFullUrl(profile: Profile) {
  return profile.imageId
    ? getProfileImageUrl(profile.userId, profile.imageId)
    : profile.image
    ? profile.image
    : '/profile.png';
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

  if (!user) {
    return null;
  }

  const profile = await getUserProfileLoader(user.id);

  return (
    <div className="flex flex-col sm:items-center">
      <Image
        //src={getProfileImageFullUrl(profile)}
        width={200}
        src="https://crm-buddy-database-next-js14-crm-buddy.fbhmyq.easypanel.host/api/users/1/images/e9d7901e-6ec3-4ff8-bf27-0c05288fd91b"
        height={200}
        className="h-[200px] sm:h-[200px] w-full object-cover rounded-xl mb-4 sm:mb-6"
        alt="Profile image"
      />
      <ProfileImageForm />
    </div>
  );
}
