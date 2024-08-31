import { HeaderLinks } from './header-links';

export async function Header() {
  return (
    <div className="px-5 md:px- bg-slate-200">
      <div className="mx-auto flex w-full max-w-7xl py-4 justify-between">
        <div className="flex justify-between gap-10 items-center">
          {/* <Link href="/" className="flex items-center gap-2">
            <Image
              src="/group.jpeg"
              alt="Group Finder Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-sm md:text-base lg:text-2xl font-bold">
              {applicationName}
            </span>
          </Link> */}

          <HeaderLinks />
        </div>

        <div className="flex items-center justify-between gap-5">
          {/* <Suspense fallback={<HeaderActionsFallback />}>
            <HeaderActions />
          </Suspense> */}
        </div>
      </div>
    </div>
  );
}
