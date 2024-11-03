'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { rateLimitByKey } from '@/lib/limiter';
import sanitizeHtml from 'sanitize-html';
import { uploadDocumentUseCase } from '@/use-cases/documents';
import { getDocuments, deleteDocument } from '@/data-access/documents';
import { getFileUrl } from '@/lib/files';
import { getDocumentKey } from '@/use-cases/documents';
import { PublicError } from '@/use-cases/errors';

export const uploadDocumentAction = authenticatedAction
  .createServerAction()
  .input(z.object({ fileWrapper: z.instanceof(FormData) }))
  .handler(async ({ input, ctx }) => {
    const clientId = parseInt(input.fileWrapper.get('clientId') as string, 10);
    await rateLimitByKey({
      key: `upload-document-${ctx.user.id}-${clientId}`,
      limit: 3,
      window: 60000
    });
    const file = input.fileWrapper.get('file') as File;
    const name = sanitizeHtml(input.fileWrapper.get('name') as string);
    const description = sanitizeHtml(
      input.fileWrapper.get('description') as string
    );

    await uploadDocumentUseCase(file, name, description, clientId, ctx.user.id);
    revalidatePath(`/dashboard/clients/${clientId}/documents`);
  });

export const getDocumentsAction = authenticatedAction
  .createServerAction()
  .input(z.object({ clientId: z.number() }))
  .handler(async ({ input }) => {
    const documents = await getDocuments(input.clientId);
    return Promise.all(
      documents.map(async doc => {
        if (!doc.documentId) {
          throw new PublicError('Invalid document ID');
        }
        return {
          ...doc,
          downloadUrl: await getFileUrl({
            key: getDocumentKey(doc.clientId, doc.userId, doc.documentId)
          })
        };
      })
    );
  });

export const deleteDocumentAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      clientId: z.number(),
      documentId: z.string()
    })
  )
  .handler(async ({ input, ctx }) => {
    if (!input.documentId) {
      throw new PublicError('Invalid document ID');
    }
    await deleteDocument(input.clientId, ctx.user.id, input.documentId);
    revalidatePath(`/dashboard/clients/${input.clientId}/documents`);
  });
