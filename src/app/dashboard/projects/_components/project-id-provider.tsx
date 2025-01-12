'use client';

import { useProjectStore } from '@/store/projectStore';
import { useLayoutEffect } from 'react';

type ProjectIdProviderProps = {
  projectId: number;
  children: React.ReactNode;
};

export const ProjectIdProvider = ({
  projectId,
  children
}: ProjectIdProviderProps) => {
  const setCurrentProjectId = useProjectStore(
    state => state.setCurrentProjectId
  );

  useLayoutEffect(() => {
    setCurrentProjectId(projectId);
  }, [projectId, setCurrentProjectId]);

  return <>{children}</>;
};
