import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';

import { UploadDocumentButton } from '../../components/upload-document-button';
import { UploadDocumentModal } from '../../components/upload-document-modal';
import { getDocuments } from '@/data-access/documents';
import { getFileUrl } from '@/lib/files';
import { getDocumentKey } from '@/use-cases/documents';
import { DeleteDocumentButton } from '../../components/delete-document-button';
//import { DeleteDocumentButton } from '../../components/delete-document-button';

export default async function DocumentsPage({
  params
}: {
  params: { clientId: string };
}) {
  const clientId = parseInt(params.clientId, 10);
  const documents = await getDocuments(clientId);

  const documentsWithUrls = await Promise.all(
    documents.map(async doc => ({
      ...doc,
      downloadUrl: await getFileUrl({
        key: getDocumentKey(doc.clientId, doc.userId, doc.documentId)
      })
    }))
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-9">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <UploadDocumentButton />
      </div>

      <UploadDocumentModal />

      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentsWithUrls.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                No documents found
              </div>
            )}
            {documentsWithUrls.map(doc => (
              <div
                key={doc.documentId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <a
                      href={doc.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {doc.name}
                    </a>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                    <p className="text-xs text-gray-400">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString()
                        : 'Date not available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DeleteDocumentButton
                    clientId={clientId}
                    documentId={doc.documentId}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
