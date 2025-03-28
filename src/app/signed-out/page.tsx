'use client';

import { Button } from '@/components/ui/button';
import { pageTitleStyles } from '@/styles/common';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignedOutPage() {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="py-24 mx-auto max-w-[600px] space-y-6 min-h-[80vh] flex flex-col justify-center items-center">
      <h1 className={pageTitleStyles}>Successfully Signed Out</h1>
      <p className="text-xl text-center">
        You have been successfully signed out. You can now sign in to your
        account.
      </p>

      <Button asChild>
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  );
}
