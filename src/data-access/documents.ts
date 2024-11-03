import { database } from '@/db/drizzle';
import { ClientId, documents } from '@/db/schema';
import { UserId } from '@/use-cases/types';
import { and, eq } from 'drizzle-orm';

//create a document in the database.
export async function createDocument(
  clientId: ClientId,
  userId: UserId,
  documentId: string,
  name: string,
  description: string
) {
  await database.insert(documents).values({
    clientId,
    userId,
    documentId,
    name,
    description
  });
}

//get all documents for a client.
export async function getDocuments(clientId: ClientId) {
  return await database
    .select()
    .from(documents)
    .where(eq(documents.clientId, clientId));
}

//delete a document from the database for a certain client and user.
export async function deleteDocument(
  clientId: ClientId,
  userId: UserId,
  documentId: string
) {
  await database
    .delete(documents)
    .where(
      and(
        eq(documents.clientId, clientId),
        eq(documents.userId, userId),
        eq(documents.documentId, documentId)
      )
    );
}
