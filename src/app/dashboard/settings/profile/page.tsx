//import { ProfileImage } from '@/app/dashboard/settings/profile/profile-image';
//import { ProfileName } from '@/app/dashboard/settings/profile/profile-name';
//import { EditBioForm } from './edit-bio-form';
import { assertAuthenticated } from '@/lib/session';
import { Suspense, cache } from 'react';
import { getUserProfileUseCase } from '@/use-cases/users';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfigurationPanel } from '@/components/configuration-panel';
import { ProfileImage } from './_components/profile-image';
import { ProfileNameBio } from './_components/profile-name-bio';

export const getUserProfileLoader = cache(getUserProfileUseCase);

export default async function SettingsPage() {
  const user = await assertAuthenticated();
  const profile = await getUserProfileLoader(user.id);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <ProfileImage />
        <ProfileNameBio
          initialName={profile?.displayName || ''}
          initialBio={profile.bio}
        />
      </div>

      {/* <ConfigurationPanel title="Profile Bio">
        <Suspense fallback={<Skeleton className="w-full h-[400px] rounded" />}>
        
        </Suspense>
      </ConfigurationPanel> */}
    </div>
  );
}

// export async function BioFormWrapper() {
//   const user = await assertAuthenticated();
//   const profile = await getUserProfileLoader(user.id);
//   return <EditBioForm bio={profile.bio} />;
// }
