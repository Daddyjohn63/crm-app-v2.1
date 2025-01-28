import { ReactNode } from 'react';

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="bg-backgroundMuted py-12">
      <div className="container">{children}</div>
    </div>
  );
}
