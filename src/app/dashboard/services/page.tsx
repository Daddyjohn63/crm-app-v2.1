import { PageHeader } from '@/components/page-header';
import { pageTitleStyles, pageWrapperStyles } from '@/styles/common';
import CreateEditServiceButton from './create-edit-service-button';
import { assertAuthenticated } from '@/lib/session';
import { getServicesUseCase } from '@/use-cases/services';
import { Services } from '@/db/schema/index';
import Link from 'next/link';
import { ServiceCard } from './_components/service-card';

interface CreateEditServiceButtonProps {
  serviceId: string | null | undefined;
}
export default async function ServicesPage() {
  const user = await assertAuthenticated();
  const services = await getServicesUseCase(user);
  const hasServices = services.length > 0;

  return (
    <>
      <PageHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col gap-4 mb-4 md:mb-0">
            <h1
              className={`${pageTitleStyles} text-2xl sm:text-3xl md:text-4xl`}
            >
              Services
            </h1>
            {!hasServices && (
              <div className="text-gray-600">No services found</div>
            )}
          </div>
          <div>
            <CreateEditServiceButton serviceId={null} />
          </div>
        </div>
      </PageHeader>
      {hasServices && (
        <div
          className={`${pageWrapperStyles} px-4 sm:px-6 transition-opacity duration-300`}
        >
          <ServicesList services={services} />
        </div>
      )}
    </>
  );
}

async function ServicesList({ services }: { services: Services[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {services.map(service => (
        <Link href={`/dashboard/services/${service.id}`} key={service.id}>
          <ServiceCard service={service} />
        </Link>
      ))}
    </div>
  );
}
