'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useProjectOverlayStore } from '@/store/projectOverlayStore';
import { ZustandInteractiveOverlay } from './zustand-intereactive-overlay';

interface CreateEditProjectButtonProps {
  projectId: string | null | undefined;
}

export default function CreateEditProjectButton({
  projectId
}: CreateEditProjectButtonProps) {
  const { setIsOpen, setProjectId } = useProjectOverlayStore();

  const handleCreateOrEditProject = () => {
    if (projectId) {
      setProjectId(parseInt(projectId));
    } else {
      setProjectId(null);
    }
    setIsOpen(true);
  };

  return (
    <>
      <ZustandInteractiveOverlay
        title={projectId ? 'Edit Project' : 'Create a Project'}
        description={
          projectId ? 'Edit an existing Project' : 'Create a new Project'
        }
        form={<div>Form</div>}
      />

      <Button onClick={handleCreateOrEditProject} className={btnStyles}>
        <PlusCircle className={btnIconStyles} />
        {projectId ? 'Edit Project' : 'Create Project'}
      </Button>
    </>
  );
}
