'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { btnIconStyles, btnStyles } from '@/styles/icons';
//import DocumentUploadForm from '../../../components/document-upload-form';
import { useDocumentDialogStore } from '@/store/documentDialogStore';
import DocumentUploadForm from './document-upload-form';

export function UploadDocumentModal() {
  const { isOpen, setIsOpen } = useDocumentDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a PDF document. Maximum file size is 5MB.
          </DialogDescription>
        </DialogHeader>
        <DocumentUploadForm />
      </DialogContent>
    </Dialog>
  );
}
