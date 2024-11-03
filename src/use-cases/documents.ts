import { ClientId } from '@/db/schema';
import { UserId } from './types';
import { uploadFileToBucket } from '@/lib/files';
import { PublicError } from './errors';
import { MAX_UPLOAD_DOCUMENT_SIZE_IN_MB } from '@/app-config';
import { createUUID } from '@/util/uuid';
import { createDocument } from '@/data-access/documents';

//get the key for the document in the bucket. This will be used to store the document in R2.
export function getDocumentKey(
  clientId: ClientId,
  userId: UserId,
  documentId: string
) {
  return `clients/${clientId}/documents/${userId}/${documentId}`;
}

export async function uploadDocumentUseCase(
  file: File,
  name: string,
  description: string,
  clientId: ClientId,
  userId: UserId
) {
  if (file.type !== 'application/pdf') {
    throw new PublicError('File should be a PDF document.');
  }
  const MAX_FILE_SIZE_BYTES = MAX_UPLOAD_DOCUMENT_SIZE_IN_MB * 1024 * 1024;

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new PublicError(
      `File size should be less than ${MAX_UPLOAD_DOCUMENT_SIZE_IN_MB}MB.`
    );
  }

  const documentId = createUUID();
  await uploadFileToBucket(file, getDocumentKey(clientId, userId, documentId));
  await createDocument(clientId, userId, documentId, name, description);
}
