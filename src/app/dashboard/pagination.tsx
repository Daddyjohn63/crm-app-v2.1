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
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious
                href={`/dashboard?page=${
                  page - 1
                }&stage=${stage}&search=${search}`}
              />
            </PaginationItem>

            {page > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

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

        <PaginationItem>
          <PaginationLink isActive={true} href={`/dashboard?page=${page}`}>
            {page}
          </PaginationLink>
        </PaginationItem>

        {page < totalPages && (
          <>
            <PaginationItem>
              <PaginationLink
                href={`/dashboard?page=${
                  page + 1
                }&stage=${stage}&search=${search}`}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>

            {page < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

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
