import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { UploadDocumentButton } from '../../components/upload-document-button';
import { UploadDocumentModal } from '../../components/upload-document-modal';

export default function DocumentsPage() {
  const documents = [
    {
      id: 1,
      name: 'Contract.pdf',
      description: 'Client contract document',
      createdAt: new Date().toLocaleDateString()
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-9">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <UploadDocumentButton />
      </div>

      <UploadDocumentModal />

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                    <p className="text-xs text-gray-400">{doc.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Trash2Icon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
