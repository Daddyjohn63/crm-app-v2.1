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
import { useEffect, useState, useMemo, memo } from 'react';
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

const BoardLink = memo(
  ({ board, pathname }: { board: Board; pathname: string }) => {
    const isActive = pathname === `/dashboard/projects/${board.id}`;

    return (
      <Link
        href={`/dashboard/projects/${board.id}`}
        className={`block text-sm transition-colors truncate
        ${
          isActive
            ? 'bg-primary text-white rounded-md'
            : 'hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md'
        }`}
        style={{
          padding: '0.5rem'
        }}
      >
        {board.name}
      </Link>
    );
  }
);

BoardLink.displayName = 'BoardLink';

interface ClientAccordionItemProps {
  client: ClientWithBoards;
  pathname: string;
  onExpand: (id: string) => void;
}

const ClientAccordionItem = memo(
  ({ client, pathname, onExpand }: ClientAccordionItemProps) => {
    return (
      <AccordionItem
        key={client.clientId}
        value={client.clientId.toString()}
        className="overflow-hidden mr-2"
      >
        <AccordionTrigger
          className="hover:no-underline"
          onClick={() => onExpand(client.clientId.toString())}
        >
          <p className="text-sm font-medium truncate">{client.clientName}</p>
        </AccordionTrigger>
        <AccordionContent className="overflow-hidden">
          <div className="flex flex-col space-y-1">
            {client.boards.length > 0 ? (
              <div className="pl-2 space-y-1">
                {client.boards.map((board, index) => (
                  <div key={board.id}>
                    {index > 0 && <Separator className="my-1" />}
                    <BoardLink board={board} pathname={pathname} />
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
    );
  }
);

ClientAccordionItem.displayName = 'ClientAccordionItem';

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
    <aside
      className="flex flex-col w-64 overflow-hidden"
      style={{
        height: 'calc(100vh - 65px)'
      }}
    >
      <div className="font-medium flex items-center mt-7 mb-1 py-2">
        <span className="text-xl text-muted-foreground">
          Projects by Client
        </span>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <Accordion
          type="multiple"
          defaultValue={defaultAccordionValue}
          className="overflow-hidden"
        >
          {validClients.map(client => (
            <ClientAccordionItem
              key={client.clientId}
              client={client}
              pathname={pathname}
              onExpand={onExpand}
            />
          ))}
        </Accordion>
      </div>
    </aside>
  );
};
