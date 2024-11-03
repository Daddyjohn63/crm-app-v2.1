//import { createInsertSchema } from 'drizzle-zod';
import {
  timestamp,
  text,
  pgEnum,
  serial,
  boolean,
  pgTable,
  integer,
  varchar,
  primaryKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['member', 'admin']);
export const accountTypeEnum = pgEnum('type', ['email', 'google', 'github']);

//users table
export const users = pgTable('crm_user', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' })
});
//how the user has chosen to sign in. It references the users table. The relationship is on the userId column.It is a one to one relationship.
export const accounts = pgTable('gf_accounts', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountType: accountTypeEnum('accountType').notNull(),
  githubId: text('githubId').unique(),
  googleId: text('googleId').unique(),
  password: text('password'),
  salt: text('salt')
});
//does not have any explicit defined relationships.But it does have an implicit relationship through email field.
export const magicLinks = pgTable('gf_magic_links', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  token: text('token'),
  tokenExpiresAt: timestamp('tokenExpiresAt', { mode: 'date' })
});

export const resetTokens = pgTable('gf_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  token: text('token'),
  tokenExpiresAt: timestamp('tokenExpiresAt', { mode: 'date' })
});

export const verifyEmailTokens = pgTable('gf_verify_email_tokens', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  token: text('token'),
  tokenExpiresAt: timestamp('tokenExpiresAt', { mode: 'date' })
});

export const profiles = pgTable('gf_profile', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  displayName: text('displayName'),
  imageId: text('imageId'), //if they upload their own avatar image to R2
  image: text('image'), //if they sign in with Google or Github.
  bio: text('bio').notNull().default('')
});

export const documents = pgTable('gf_documents', {
  id: serial('id').primaryKey(),
  clientId: serial('clientId')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  documentId: text('documentId').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow()
});

export const sessions = pgTable('gf_session', {
  id: text('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date'
  }).notNull()
});

export const subscriptions = pgTable('gf_subscriptions', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
  stripeCustomerId: text('stripeCustomerId').notNull(),
  stripePriceId: text('stripePriceId').notNull(),
  stripeCurrentPeriodEnd: timestamp('expires', { mode: 'date' }).notNull()
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  business_name: text('business_name').notNull(),
  primary_address: varchar('primary_address', { length: 250 }).notNull(),
  primary_email: text('primary_email').notNull(),
  primary_phone: text('primary_phone').notNull(),
  business_description: text('business_description').notNull(),
  date_onboarded: timestamp('date', { mode: 'date' }).notNull(),
  additional_info: text('additional_info').notNull()
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('service_name').notNull(),
  description: varchar('service_description', { length: 500 }).notNull(),
  included_services: varchar('included_services', { length: 500 }),
  delivery_process: varchar('deleivery_process', { length: 500 }),
  pricing: varchar('pricing', { length: 500 })
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  clientId: serial('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  last_name: text('last_name').notNull(),
  first_name: text('first_name').notNull(),
  job_title: text('job_title').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  county: text('county').notNull(),
  postcode: text('postcode').notNull(),
  country: text('country').notNull()
});

export const notifications = pgTable('gf_notifications', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  groupId: serial('groupId')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  postId: integer('postId'),
  isRead: boolean('isRead').notNull().default(false),
  type: text('type').notNull(),
  message: text('message').notNull(),
  createdOn: timestamp('createdOn', { mode: 'date' }).notNull()
});

export const posts = pgTable('gf_posts', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  groupId: serial('groupId')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  createdOn: timestamp('createdOn', { mode: 'date' }).notNull()
});

export const reply = pgTable('gf_replies', {
  id: serial('id').primaryKey(),
  userId: serial('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  postId: serial('postId')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  groupId: serial('groupId')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  createdOn: timestamp('createdOn', { mode: 'date' }).notNull()
});

export const clientsToServices = pgTable(
  'clients_to_services',
  {
    clientId: serial('client_id')
      .notNull()
      .references(() => clients.id, { onDelete: 'cascade' }),
    serviceId: serial('service_id')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' })
  },
  t => ({
    pk: primaryKey({ columns: [t.clientId, t.serviceId] })
  })
);

//relationships for the documents table
export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
  client: one(clients, {
    fields: [documents.clientId],
    references: [clients.id]
  })
}));

// Relationships for the users table
export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  services: many(services)
}));

// Relationships for the clients table
export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, {
    fields: [clients.userId],
    references: [users.id]
  }),
  clientsToServices: many(clientsToServices)
}));

// Relationships for the contacts table
export const contactsRelations = relations(contacts, ({ one }) => ({
  client: one(clients, {
    fields: [contacts.clientId],
    references: [clients.id]
  })
}));

// Relationships for the services table
export const servicesRelations = relations(services, ({ one, many }) => ({
  user: one(users, {
    fields: [services.userId],
    references: [users.id]
  }),
  clientsToServices: many(clientsToServices)
}));

// Relationships for the clientsToServices table
export const clientsToServicesRelations = relations(
  clientsToServices,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientsToServices.clientId],
      references: [clients.id]
    }),
    service: one(services, {
      fields: [clientsToServices.serviceId],
      references: [services.id]
    })
  })
);
//relationships for the posts table
export const postsRelationships = relations(posts, ({ one }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  group: one(clients, { fields: [posts.groupId], references: [clients.id] })
}));

//export types
// following wdc schema
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert; // Ensure this line is correct
export type NewClientInput = Omit<NewClient, 'id' | 'createdAt' | 'updatedAt'>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Services = typeof services.$inferSelect;
export type NewServices = typeof services.$inferInsert;
export type ClientId = Client['id'];
export type ServicesId = Services['id'];
export type ContactId = Contact['id'];
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type NewContactInput = Omit<
  NewContact,
  'id' | 'createdAt' | 'updatedAt'
>;
export type NewServiceInput = Omit<
  NewServices,
  'id' | 'createdAt' | 'updatedAt'
>;
export type ContactWithStringId = Omit<Contact, 'id'> & { id: string };

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
