import { appConfig } from '@/app-config';
import { getCurrentUser } from '@/lib/session';
import { ComingSoon } from '../(coming-soon)/coming-soon';
import { HeroSection } from './_sections/hero';

export default async function LandingPage() {
  if (appConfig.mode === 'comingSoon') {
    return <ComingSoon />;
  }

  if (appConfig.mode === 'maintenance') {
    return (
      <div>
        <h1>Maintenance</h1>
      </div>
    );
  }

  if (appConfig.mode === 'live') {
    return (
      <div>
        <HeroSection />
      </div>
    );
  }
}
