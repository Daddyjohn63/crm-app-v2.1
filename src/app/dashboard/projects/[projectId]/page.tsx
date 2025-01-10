import { notFound, redirect } from 'next/navigation';
import { getProjectById, getListsByBoardId } from '@/use-cases/projects';
import { Board, List, Card } from '@/db/schema';
import { Suspense } from 'react';
import { PublicError } from '@/use-cases/errors';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings } from 'lucide-react';
import { getCurrentUser } from '@/lib/session';
import { ListContainer } from '../_components/list-container';

interface PageProps {
  params: {
    projectId: string;
  };
}

// Loading component for the project details
function ProjectSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        {/* Title skeleton */}
        <Skeleton className="h-9 w-[200px]" />

        <div className="space-y-2">
          {/* Project ID skeleton */}
          <Skeleton className="h-5 w-[150px]" />
          {/* Description skeleton */}
          <Skeleton className="h-5 w-[300px]" />
        </div>
      </div>

      <div className="space-y-2">
        {/* Created date skeleton */}
        <Skeleton className="h-5 w-[180px]" />
        {/* Updated date skeleton */}
        <Skeleton className="h-5 w-[180px]" />
      </div>
    </div>
  );
}

// Separate data fetching logic
async function getProject(projectId: string): Promise<Board> {
  try {
    const id = parseInt(projectId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid project ID');
    }

    const project = await getProjectById(id);

    if (!project) {
      notFound();
    }

    return project;
  } catch (error) {
    if (error instanceof PublicError) {
      throw error;
    }
    console.error('Error fetching project:', error);
    throw new Error('Failed to load project');
  }
}

type ListWithCards = List & {
  cards: Card[];
};

function ProjectDetails({
  project,
  user,
  lists
}: {
  project: Board;
  user: any;
  lists: ListWithCards[];
}) {
  return (
    <div className="pt-8 space-y-6">
      <nav className="flex bg-indigo-900">
        <div className="flex justify-between items-center w-full p-3">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Settings className="w-6 h-6 cursor-pointer" />
        </div>
      </nav>
      <div className="space-y-2 overflow-x-auto">
        <ListContainer boardId={project.id} data={lists} user={user} />
      </div>
    </div>
  );
}

export const revalidate = 3600;

export default async function ProjectPage({ params }: PageProps) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <AsyncProjectContent projectId={params.projectId} />
    </Suspense>
  );
}

async function AsyncProjectContent({ projectId }: { projectId: string }) {
  const [project, user] = await Promise.all([
    getProject(projectId),
    getCurrentUserData()
  ]);

  const lists = (await getListsByBoardId(project.id)) as ListWithCards[];
  return <ProjectDetails project={project} user={user} lists={lists} />;
}

async function getCurrentUserData() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }
  return user;
}
