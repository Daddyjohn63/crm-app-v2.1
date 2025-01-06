import { Sidebar } from './_components/sidebar';

export default function ProjectsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container ">
      <div>
        <div className="flex  gap-x-7">
          <div className="w-64 shrink-0 hidden md:block">
            <Sidebar />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </main>
  );
}
