'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

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
      <div className="font-medium flex items-center mt-7 mb-1 py-2">
        <span className="text-xl text-muted-foreground">
          Projects by Client
        </span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          className=" overflow-hidden"
        >
          {validClients.map(client => (
            <AccordionItem
              key={client.clientId}
              value={client.clientId.toString()}
              className="overflow-hidden mr-2"
            >
              <AccordionTrigger
                className="hover:no-underline"
                onClick={() => onExpand(client.clientId.toString())}
              >
                <p className="text-sm font-medium truncate">
                  {client.clientName}
                </p>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden">
                <div className="flex flex-col space-y-1">
                  {client.boards.length > 0 ? (
                    <div className="pl-2 space-y-1">
                      {client.boards.map((board, index) => (
                        <div key={board.id}>
                          {index > 0 && <Separator className="my-1" />}
                          <Link
                            href={`/dashboard/projects/${board.id}`}
                            className={`block py-1 px-2 text-sm transition-colors truncate
                              ${
                                pathname === `/dashboard/projects/${board.id}`
                                  ? 'bg-primary text-white rounded-md py-2 px-2'
                                  : 'hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md py-2 px-2'
                              }`}
                          >
                            {board.name}
                          </Link>
                        </div>
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
