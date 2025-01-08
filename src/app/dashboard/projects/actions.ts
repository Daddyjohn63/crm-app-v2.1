'use server';

import { getCurrentUser } from '@/lib/session';
import { createBoard } from '@/use-cases/projects';

// Server action
// async function createProjectBoard(input: CreateBoardInput) {
//   const user = await getCurrentUser();
//   return await createBoard(input, user);  // calls use-case
// }

// // Use-case handles:
// - Checking if user is admin
// - Creating board
// - Setting up owner permission
// - Managing transaction

// // Data-access handles:
// - Raw database operations
// - No business logic
