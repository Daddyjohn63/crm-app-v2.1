'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Client } from '@/db/schema/index';
import { useEffect, useState } from 'react';

//storageKey will be used to store the state of the accordion i.e. open or closed. will use this to stop the accordion from collapsing after a rerender.
interface SidebarProps {
  clients?: Client[];
  storageKey?: string;
}

export const Sidebar = ({
  clients = [],
  storageKey = 'p-sidebar-state'
}: SidebarProps) => {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
    storageKey,
    {}
  );

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

  return (
    <aside className="flex flex-col w-64 h-[calc(100vh-65px)] overflow-hidden">
      <div className="font-medium flex items-center mt-8 mb-1   py-2 ">
        <span className="">Projects by Client</span>
        {/* <Button
          asChild
          type="button"
          variant="ghost"
          size="icon"
          className="ml-auto"
        >
          <Link href="/dashboard/projects/new">
            <Plus className="w-4 h-4" />
          </Link>
        </Button> */}
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          className="space-y-2 overflow-hidden"
        >
          {clients.map(client => (
            <AccordionItem
              key={client.id}
              value={client.id.toString()}
              className="overflow-hidden"
            >
              <AccordionTrigger onClick={() => onExpand(client.id.toString())}>
                {client.business_name}
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="pl-4 py-2">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    View Client Details
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
