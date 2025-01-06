'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
//import { useOrganization, useOrganizationList } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion } from '@/components/ui/accordion';

//storageKey will be used to store the state of the accordion i.e. open or closed. will use this to stop the accordion from collapsing after a rerender.
interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = 'p-sidebar-state' }: SidebarProps) => {
  //create a state to store the expanded state of the accordion
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {} //this object will eventually look like {projectId:true/false}
  );
  const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
    (acc: string[], key: string) => {
      if (expanded[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  );

  //the function above will take the storage object and convert it to an array of project ids that are expanded. Because the default value of the accordion is an array of project ids, we need to convert the storage object to an array of project ids.

  const onExpand = (id: string) => {
    setExpanded(curr => ({
      ...curr,
      [id]: !expanded[id]
    }));
  };

  //TODO: if loading, show a skeleton.

  return (
    <aside className="flex flex-col w-64 h-[calc(100vh-65px)] border-r border-gray-200">
      <div className="font-medium text-xs flex items-center mb-1 border-b border-t border-gray-200 py-2 border-r-2 border-l-2 ">
        <span className="pl-4">Projects</span>
        <Button
          asChild
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto"
        >
          <Link href="/dashboard/projects/new">
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Your scrollable content goes here */}
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          // onValueChange={setExpanded}
          className="space-y-2"
        >
          {/* get list of clients and their ids and map over them here. */}
          Project List
        </Accordion>
      </div>
    </aside>
  );
};
