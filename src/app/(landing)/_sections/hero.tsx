// import { SignedIn } from '@/components/auth';
// import { SignedOut } from '@/components/auth';
// import Container from '@/components/container';
import { SignedIn, SignedOut } from '@/components/auth';
import Container from '@/components/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <>
      <Container>
        <div className="flex flex-col md:flex-row gap-y-14 w-full justify-between">
          <div className="">
            <Badge className="text-sm md:text-base">
              Manage your clients and services
            </Badge>
            <h1 className="text-4xl md:text-6xl max-w-3xl mt-10 leading-[1.2] font-semibold">
              For professional freelancers who want to manage their client base
              better
            </h1>
            <p className="mt-5 text-gray-500 text-lg max-w-[600px]">
              A simple but effective toolset to help you manage your client
              base, service list and documentation. CRM Buddy provides you with
              the means to capture all of your client information, services and
              important documentation all in one place.
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 mt-10">
              <SignedIn>
                <Button asChild>
                  <Link href={'/dashboard'}>View Dashboard</Link>
                </Button>
              </SignedIn>

              <SignedOut>
                <Button asChild>
                  <Link href={'/sign-in'}>Create an Account</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
          <Image
            className="rounded-xl w-[400px] h-[400px]"
            width="200"
            height="200"
            src="/group.jpeg"
            alt="hero image"
          />
        </div>
      </Container>
    </>
  );
}
