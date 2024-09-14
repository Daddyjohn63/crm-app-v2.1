import { Client } from '@/db/schema';
import { getCurrentUser } from '@/lib/session';
import { cn } from '@/lib/utils';
import { headerStyles, pageTitleStyles } from '@/styles/common';
import { assertClientOwnership } from '@/use-cases/clients';
import { UsersIcon } from 'lucide-react';

export async function ClientHeader({
  client
}: {
  client: Pick<Client, 'business_name' | 'id'>;
}) {
  return (
    <div className={cn(headerStyles, 'py-4 sm:py-6 md:py-8')}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center sm:items-start sm:flex-row justify-between gap-4 sm:gap-6">
          <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
            {/* <Image
             src={getGroupImageUrl(group)}
             width={80}
             height={80}
             alt="image of the group"
             className="rounded-lg object-cover h-[80px] w-[80px] sm:h-[40px] sm:w-[40px]"
           /> */}

            <div className="space-y-2 sm:space-y-4 text-center sm:text-left">
              <h1 className={cn(pageTitleStyles, 'text-2xl sm:text-3xl')}>
                {client.business_name}
              </h1>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
