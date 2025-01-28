import { assertAuthenticated } from '@/lib/session';
import { CreateEditClientButton } from './clients/_components/create-client-button';
import { getClientsUseCase, searchClientsUseCase } from '@/use-cases/clients';
import {
  cardStyles,
  formClientStyles,
  pageTitleStyles,
  pageWrapperStyles
} from '@/styles/common';
import { cn } from '@/lib/utils';
import { Search, XIcon } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { ClientCard } from './clients/_components/client-card';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { SubmitButton } from '@/components/submit-button';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ClientPagination } from './pagination';
import {
  SALES_STAGE_FILTER_OPTIONS,
  SalesStageFilter,
  UserSession
} from '@/use-cases/types';
import { SearchFilterForm } from './clients/_components/search-filter-form';

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { search?: string; stage?: string; page?: string };
}) {
  const search = searchParams.search;
  const stage = Object.values(SALES_STAGE_FILTER_OPTIONS).includes(
    searchParams.stage as SalesStageFilter
  )
    ? (searchParams.stage as SalesStageFilter)
    : undefined;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const user = await assertAuthenticated();
  const clients = await getClientsUseCase(user);

  const hasClients = clients.length > 0;

  if (!hasClients) {
    return (
      <PageHeader>
        <div className="flex flex-col gap-4 ">
          <h1
            className={`${pageTitleStyles} text-2xl sm:text-3xl md:text-4xl pb-4`}
          >
            Browse Clients
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
            <form
              key={search}
              action={async (formData: FormData) => {
                'use server';
                const searchString = formData.get('search') as string;
                redirect(
                  searchString
                    ? `/dashboard?search=${encodeURIComponent(searchString)}`
                    : '/dashboard'
                );
              }}
              className="flex-grow sm:flex-grow-0 sm:w-1/2 max-w-md"
            >
              <div className={formClientStyles}>
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <div className="flex relative w-full">
                    <Input
                      defaultValue={search}
                      placeholder="enter all or part of the clients name"
                      name="search"
                      id="group"
                      className="w-full"
                    />
                    {search && (
                      <Button
                        size="icon"
                        variant="link"
                        className="absolute right-1"
                        asChild
                      >
                        <Link href={`/dashboard`}>
                          <XIcon />
                        </Link>
                      </Button>
                    )}
                  </div>
                  <SubmitButton className="w-full sm:w-auto">
                    Search
                  </SubmitButton>
                </div>
              </div>
            </form>
            <CreateEditClientButton
              params={{}}
              user={{
                id: user.id,
                email: null,
                emailVerified: null,
                role: user.role
              }}
            />
          </div>
          {!hasClients && <div>No clients found</div>}
        </div>
      </PageHeader>
    );
  }

  //if we have clients.
  return (
    <>
      <PageHeader>
        <div className="flex flex-col gap-4">
          <h1
            className={`${pageTitleStyles} text-2xl sm:text-3xl md:text-4xl pb-4`}
          >
            Browse Clients
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <SearchFilterForm
              initialSearch={search}
              initialStage={stage}
              formStyles={formClientStyles}
            />
            <CreateEditClientButton
              params={{}}
              user={{
                id: user.id,
                email: null,
                emailVerified: null,
                role: user.role
              }}
            />
          </div>
        </div>
      </PageHeader>
      <div
        className={`${pageWrapperStyles} px-4 sm:px-6 transition-opacity duration-300`}
      >
        {/* <Suspense fallback={<ClientsListSkeleton />}> */}
        <ClientList page={page} search={search} user={user} stage={stage} />
        {/* </Suspense> */}
      </div>
    </>
  );
}

function ClientsListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-h-[600px]">
      {new Array(6).fill('').map((v, idx) => (
        <div
          key={idx}
          className="rounded border p-4 space-y-4 h-[300px] transition-opacity duration-300"
        >
          <Skeleton className="w-[140px] h-[20px] rounded" />
          <Skeleton className="h-[40px] rounded w-full" />
          <Skeleton className="w-[80px] h-[40px] rounded" />
        </div>
      ))}
    </div>
  );
}

async function ClientList({
  search,
  page,
  user,
  stage
}: {
  search?: string;
  page: number;
  user: UserSession;
  stage?: SalesStageFilter;
}) {
  const { data, perPage, total } = await searchClientsUseCase(
    user,
    search ?? '',
    page,
    stage && stage !== SALES_STAGE_FILTER_OPTIONS.ALL ? stage : undefined
  );
  //console.log('CLIENTS-LIST-DATA', data);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-8 dark:bg-slate-900 rounded-xl">
        <Image
          src="/empty-state/mountain.svg"
          width="200"
          height="200"
          alt="no groups placeholder image"
          className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64"
        />
        <h2 className="text-xl sm:text-2xl text-center">
          No clients matching your search
        </h2>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {data.map(client => (
          <Link href={`/dashboard/clients/${client.id}`} key={client.id}>
            <ClientCard client={client} buttonText="View" />
          </Link>
        ))}
      </div>

      <ClientPagination
        search={search ?? ''}
        stage={stage ?? SALES_STAGE_FILTER_OPTIONS.ALL}
        page={page}
        totalPages={Math.ceil(total / perPage)}
      />
    </>
  );
}

//call function in clients business use case.
// if (!hasClients) {
//   return (
//     <div className="space-y-8 container mx-auto py-24 min-h-screen max-w-2xl flex flex-col items-center">
//       <div className="flex justify-between items-center">
//         <h1 className={pageTitleStyles}>Your Clients</h1>
//       </div>
//       <div
//         className={cn(
//           cardStyles,
//           'flex flex-col items-center gap-6 p-12 w-full'
//         )}
//       >
//         <h2>Uh-oh, you don't have any clients</h2>

//         <div className="flex gap-4">
//           {/* create a group button */}
//           <CreateClientButton />

//         </div>
//       </div>
//     </div>
//   );
// }

//   return (
//     <>
//       <PageHeader>
//         <h1
//           className={cn(
//             pageTitleStyles,
//             'flex justify-between items-center flex-wrap gap-4'
//           )}
//         >
//           Your Clients
//           {hasClients && <CreateClientButton />}
//         </h1>
//       </PageHeader>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 container mx-auto py-24 ">
//         {clients.map(client => (
//           <ClientCard
//             key={client.id}
//             client={client}
//             buttonText="View Client"
//           />
//         ))}
//       </div>
//     </>
//   );
// }
