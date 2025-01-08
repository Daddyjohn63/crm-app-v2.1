import { getProjectByIdAction } from '../actions';
import { notFound } from 'next/navigation';

export default async function SingleProjectPage({
  params
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  try {
    const [project, error] = await getProjectByIdAction(projectId);

    if (error || !project) {
      return notFound();
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="space-y-2">
            <p className="text-sm ">Project ID: {projectId}</p>
            {project.description && (
              <p className="text-sm ">{project.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
