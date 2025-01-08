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
import { useEffect, useState } from 'react';

interface Board {
  id: number;
  name: string;
  description: string | null;
}

interface ClientWithBoards {
  clientId: number;
  clientName: string;
  boards: Board[];
}

interface SidebarProps {
  clients?: ClientWithBoards[];
  storageKey?: string;
}

export const Sidebar = ({
  clients = [] as ClientWithBoards[],
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

  const onExpand = (id: string) => {
    setExpanded(curr => ({
      ...curr,
      [id]: !expanded[id]
    }));
  };

  if (!mounted) {
    return null;
  }

  // Filter out any invalid clients
  const validClients = clients.filter(
    (client): client is ClientWithBoards =>
      client !== undefined &&
      client !== null &&
      typeof client.clientId === 'number'
  );

  return (
    <aside className="flex flex-col w-64 h-[calc(100vh-65px)] overflow-hidden">
      <div className="font-medium flex items-center mt-8 mb-1 py-2">
        <span className="">Projects by Client</span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          className=" overflow-hidden"
        >
          {validClients.map(client => (
            <AccordionItem
              key={client.clientId}
              value={client.clientId.toString()}
              className="overflow-hidden"
            >
              <AccordionTrigger
                onClick={() => onExpand(client.clientId.toString())}
              >
                {client.clientName}
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col space-y-1">
                  {/* <div className="pl-4 py-2">
                    <Link
                      href={`/dashboard/clients/${client.clientId}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      View Client Details
                    </Link>
                  </div> */}
                  {client.boards.length > 0 ? (
                    <div className="pl-4 space-y-1">
                      {client.boards.map(board => (
                        <Link
                          key={board.id}
                          href={`/dashboard/projects/${board.id}`}
                          className="block py-1 text-sm hover:text-primary"
                        >
                          {board.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="pl-4 py-1 text-sm text-muted-foreground">
                      No projects yet
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
