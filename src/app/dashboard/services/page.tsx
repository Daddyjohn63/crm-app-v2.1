import { PageHeader } from '@/components/page-header';
import { pageTitleStyles } from '@/styles/common';
import CreateServiceButton from './create-service-button';

export default async function () {
  return (
    <PageHeader>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex gap-4 mb-4 md:mb-0">
          <h1 className={`${pageTitleStyles} text-2xl sm:text-3xl md:text-4xl`}>
            Browse Services
          </h1>
        </div>
        <div>
          <CreateServiceButton />
        </div>
      </div>
    </PageHeader>
  );
}
