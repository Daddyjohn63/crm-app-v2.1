import { ConfigurationPanel } from '@/components/configuration-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { assertAuthenticated } from '@/lib/session';
import { Suspense, cache } from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* <ProfileImage /> */}
        {/* <ProfileName /> */}
        <div>Profile Image</div>
        <div>Profile Name</div>
      </div>

      <ConfigurationPanel title="Profile Bio">
        <Suspense fallback={<Skeleton className="w-full h-[400px] rounded" />}>
          {/* <BioFormWrapper /> */}
          <div>Bio Form</div>
        </Suspense>
      </ConfigurationPanel>
    </div>
  );
}

// export async function BioFormWrapper() {
//   const user = await assertAuthenticated();
//   const profile = await getUserProfileLoader(user.id);
//   return <EditBioForm bio={profile.bio} />;
// }
