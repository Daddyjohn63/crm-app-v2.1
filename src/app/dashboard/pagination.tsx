import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { SalesStageFilter } from '@/use-cases/types';

export function ClientPagination({
  page,
  stage,
  totalPages,
  search
}: {
  page: number;
  stage: SalesStageFilter;
  totalPages: number;
  search: string;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {/* Render previous page link if current page is greater than 1 */}
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious
                href={`/dashboard?page=${
                  page - 1
                }&stage=${stage}&search=${search}`}
              />
            </PaginationItem>

            {/* Render ellipsis if there are more than two pages before the current page */}
            {page > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Render link to the previous page */}
            <PaginationItem>
              <PaginationLink
                isActive={false}
                href={`/dashboard?page=${
                  page - 1
                }&stage=${stage}&search=${search}`}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Render link for the current page, marked as active */}
        <PaginationItem>
          <PaginationLink isActive={true} href={`/dashboard?page=${page}`}>
            {page}
          </PaginationLink>
        </PaginationItem>

        {/* Render next page link if current page is less than total pages */}
        {page < totalPages && (
          <>
            {/* Render link to the next page */}
            <PaginationItem>
              <PaginationLink
                href={`/dashboard?page=${
                  page + 1
                }&stage=${stage}&search=${search}`}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            {/* Render ellipsis if there are more than two pages after the current page */}
            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Render next page link */}
            <PaginationItem>
              <PaginationNext
                href={`/dashboard?page=${
                  page + 1
                }&stage=${stage}&search=${search}`}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
