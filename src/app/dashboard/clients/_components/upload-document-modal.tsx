'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

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
