import { pgEnum } from 'drizzle-orm/pg-core';

export const actionEnum = pgEnum('action', ['CREATE', 'UPDATE', 'DELETE']);

export const entityTypeEnum = pgEnum('entity_type', ['BOARD', 'LIST', 'CARD']);

export type Action = (typeof actionEnum.enumValues)[number];
export type EntityType = (typeof entityTypeEnum.enumValues)[number];
