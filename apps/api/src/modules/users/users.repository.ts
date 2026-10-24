import { and, eq, desc, sql } from 'drizzle-orm';
import { users, usersSessions, type User, type UserSession } from '~/database/schema.js';
import { getFirstValue } from '~/shared/helpers/get-first-value.js';
import type { Deps } from '~/shared/types/deps.js';

export class UsersRepository {
  constructor(private readonly deps: Deps<'db'>) {}

  findById(id: number) {
    return getFirstValue(
      this.deps.db
        .select({
          id: users.id,
          username: users.username,
          refreshToken: usersSessions.refreshToken,
        })
        .from(users)
        .leftJoin(usersSessions, eq(usersSessions.userId, users.id))
        .where(eq(users.id, id))
        .limit(1),
    );
  }

  update(id: number, payload: Partial<User>) {
    return getFirstValue(
      this.deps.db
        .update(users)
        .set(payload)
        .where(eq(users.id, id))
        .returning({ id: users.id, username: users.username }),
    );
  }

  findByUsernameWithPassword(username: string) {
    return getFirstValue(
      this.deps.db.select().from(users).where(eq(users.username, username)).limit(1),
    );
  }

  findByUserIdWithPassword(id: number) {
    return getFirstValue(this.deps.db.select().from(users).where(eq(users.id, id)).limit(1));
  }

  updateSession(userId: number, sessionId: string, payload: Partial<UserSession>) {
    return this.deps.db
      .update(usersSessions)
      .set(payload)
      .where(and(eq(usersSessions.userId, userId), eq(usersSessions.sessionId, sessionId)))
      .returning({
        userId: usersSessions.userId,
        refreshToken: usersSessions.refreshToken,
      });
  }

  createSession(payload: UserSession) {
    return getFirstValue(
      this.deps.db
        .insert(usersSessions)
        .values(payload)
        .returning({ sessionId: usersSessions.sessionId }),
    );
  }

  getUserSession(userId: number, sessionId: string) {
    return getFirstValue(
      this.deps.db
        .select({
          refreshToken: usersSessions.refreshToken,
          userId: usersSessions.userId,
        })
        .from(usersSessions)
        .where(and(eq(usersSessions.userId, userId), eq(usersSessions.sessionId, sessionId)))
        .limit(1),
    );
  }

  removeSession(sessionId: string) {
    return this.deps.db.delete(usersSessions).where(eq(usersSessions.sessionId, sessionId));
  }

  getSessions(userId: number) {
    return this.deps.db
      .select({
        deviceInfo: usersSessions.deviceInfo,
        lastActivityAt: usersSessions.lastActivityAt,
        id: usersSessions.id,
        sessionId: usersSessions.sessionId,
      })
      .from(usersSessions)
      .where(eq(usersSessions.userId, userId))
      .orderBy(desc(usersSessions.lastActivityAt));
  }

  terminateSession(id: number) {
    return this.deps.db.delete(usersSessions).where(eq(usersSessions.id, id));
  }

  getDisplayData(userId: number) {
    return getFirstValue(
      this.deps.db
        .select({
          id: users.id,
          username: users.username,
        })
        .from(users)
        .where(eq(users.id, userId)),
    );
  }

  async clearStaledSessions(userId: number) {
    await this.deps.db
      .delete(usersSessions)
      .where(and(sql`updated_at < NOW() - INTERVAL '10 days'`, eq(usersSessions.userId, userId)));
  }
}
