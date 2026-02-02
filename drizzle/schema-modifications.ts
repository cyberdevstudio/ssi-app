// ============================================
// MODIFICATIONS À APPORTER DANS drizzle/schema.ts
// ============================================

// Dans la table users, ajoutez ce champ après "email":

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  
  // AJOUTEZ CETTE LIGNE:
  passwordHash: text("password_hash"), // Pour l'authentification locale
  
  loginMethod: varchar("login_method", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  organizationId: int("organization_id").notNull().default(1),
  phone: varchar("phone", { length: 20 }),
  department: varchar("department", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

// Après avoir modifié le schéma, exécutez:
// pnpm db:push
