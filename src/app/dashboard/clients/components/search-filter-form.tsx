'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { XIcon } from 'lucide-react';
import { SubmitButton } from '@/components/submit-button';
import {
  SALES_STAGE_FILTER_OPTIONS,
  SalesStageFilter
} from '@/use-cases/types';
import { handleSearch } from '../../actions';
//import { handleSearch } from '../actions';

export function SearchFilterForm({
  initialSearch,
  initialStage,
  formStyles
}: {
  initialSearch?: string;
  initialStage?: SalesStageFilter;
  formStyles: string;
}) {
  const [selectedStage, setSelectedStage] = useState<SalesStageFilter>(
    initialStage ?? SALES_STAGE_FILTER_OPTIONS.ALL
  );
  const [searchValue, setSearchValue] = useState(initialSearch ?? '');
  const router = useRouter();

  const handleStageChange = (value: string) => {
    setSelectedStage(value as SalesStageFilter);
  };

  return (
    <form
      key={initialSearch}
      action={handleSearch}
      className="flex-grow sm:flex-grow-0 sm:w-1/2 max-w-md"
    >
      <div className={formStyles}>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Select
            value={selectedStage}
            onValueChange={handleStageChange}
            name="stage"
          >
            <SelectTrigger className="w-full min-w-[250px]">
              <SelectValue>{selectedStage.replace(/_/g, ' ')}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(SALES_STAGE_FILTER_OPTIONS).map(stageOption => (
                <SelectItem
                  key={stageOption}
                  value={stageOption}
                  className="capitalize"
                >
                  {stageOption.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex relative w-full">
            <Input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="enter all or part of the clients name"
              name="search"
              id="group"
              className="w-full min-w-[300px]"
            />
            {searchValue && (
              <Button
                type="button"
                size="icon"
                variant="link"
                className="absolute right-1"
                onClick={() => {
                  setSearchValue('');
                  const params = new URLSearchParams();
                  if (selectedStage !== SALES_STAGE_FILTER_OPTIONS.ALL) {
                    params.set('stage', selectedStage);
                  }
                  router.push(
                    params.toString()
                      ? `/dashboard?${params.toString()}`
                      : '/dashboard'
                  );
                }}
              >
                <XIcon />
              </Button>
            )}
          </div>

          <SubmitButton className="w-full sm:w-auto">Search</SubmitButton>
        </div>
      </div>
    </form>
  );
}
