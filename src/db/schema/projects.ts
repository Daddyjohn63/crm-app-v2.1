import {
  timestamp,
  text,
  serial,
  boolean,
  pgTable,
  integer,
  index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users, clients } from './base';
import { actionEnum, entityTypeEnum } from './enums';

// Boards Schema
export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  clientId: serial('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Lists Schema
export const lists = pgTable('lists', {
  id: serial('id').primaryKey(),
  boardId: serial('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Cards Schema
export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  listId: serial('list_id')
    .notNull()
    .references(() => lists.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  dueDate: timestamp('due_date', { mode: 'date' }),
  assignedTo: serial('assigned_to').references(() => users.id),
  estimatedMinutes: integer('estimated_minutes'),
  totalMinutes: integer('total_minutes').default(0),
  isTimerActive: boolean('is_timer_active').default(false),
  lastTimerStart: timestamp('last_timer_start'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Time Entries Schema
export const timeEntries = pgTable(
  'time_entries',
  {
    id: serial('id').primaryKey(),
    cardId: serial('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    userId: serial('user_id')
      .notNull()
      .references(() => users.id),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    durationMinutes: integer('duration_minutes'),
    description: text('description'),
    billable: boolean('billable').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  },
  table => ({
    cardIdIdx: index('time_entries_card_id_idx').on(table.cardId),
    userIdIdx: index('time_entries_user_id_idx').on(table.userId)
  })
);

// Audit Logs Schema
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id')
      .notNull()
      .references(() => users.id),
    action: actionEnum('action').notNull(),
    entityId: integer('entity_id').notNull(),
    entityType: entityTypeEnum('entity_type').notNull(),
    entityTitle: text('entity_title').notNull(),
    userName: text('user_name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    clientId: serial('client_id')
      .references(() => clients.id, { onDelete: 'cascade' })
      .notNull()
  },
  table => ({
    userIdIdx: index('audit_logs_user_id_idx').on(table.userId),
    entityIdTypeIdx: index('audit_logs_entity_id_type_idx').on(
      table.entityId,
      table.entityType
    ),
    clientIdIdx: index('audit_logs_client_id_idx').on(table.clientId)
  })
);

// Relations
export const boardsRelations = relations(boards, ({ one, many }) => ({
  client: one(clients, {
    fields: [boards.clientId],
    references: [clients.id]
  }),
  user: one(users, {
    fields: [boards.userId],
    references: [users.id]
  }),
  lists: many(lists)
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, {
    fields: [lists.boardId],
    references: [boards.id]
  }),
  cards: many(cards)
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  list: one(lists, {
    fields: [cards.listId],
    references: [lists.id]
  }),
  assignedUser: one(users, {
    fields: [cards.assignedTo],
    references: [users.id]
  }),
  timeEntries: many(timeEntries)
}));

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  card: one(cards, {
    fields: [timeEntries.cardId],
    references: [cards.id]
  }),
  user: one(users, {
    fields: [timeEntries.userId],
    references: [users.id]
  })
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id]
  }),
  client: one(clients, {
    fields: [auditLogs.clientId],
    references: [clients.id]
  })
}));

// Types
export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
export type BoardId = Board['id'];

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;
export type ListId = List['id'];

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type CardId = Card['id'];

export type TimeEntry = typeof timeEntries.$inferSelect;
export type NewTimeEntry = typeof timeEntries.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
