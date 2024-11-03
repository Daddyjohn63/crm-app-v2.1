'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
import { useDocumentDialogStore } from '@/store/documentDialogStore';

export function UploadDocumentButton() {
  const { setIsOpen } = useDocumentDialogStore();

  return (
    <Button onClick={() => setIsOpen(true)} className={btnStyles}>
      <PlusCircle className={btnIconStyles} />
      Upload Document
    </Button>
  );
}
