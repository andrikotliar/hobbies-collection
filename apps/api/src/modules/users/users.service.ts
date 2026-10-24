import type { User, UserSession } from '~/database/schema.js';
import crypto from 'node:crypto';
import type { UpdateUserInput, UserSessionResponse } from '@hobbies-collection/shared';
import type { Deps } from '~/shared/types/deps.js';
import { throwIfNotFound } from '~/shared/helpers/throw-if-not-found.js';
import type { RequestUser } from '~/shared/helpers/get-request-user.js';
import { BadRequestException } from '~/shared/exceptions/bad-request.js';

export class UsersService {
  constructor(private readonly deps: Deps<'usersRepository' | 'jwt' | 'hashService'>) {}

  getUser(userId: number) {
    return this.deps.usersRepository.findById(userId);
  }

  async getUserByUsername(username: string) {
    return this.deps.usersRepository.findByUsernameWithPassword(username);
  }

  async setRefreshToken(userId: number, sessionId: string, token: string | null) {
    const now = new Date();
    return this.deps.usersRepository.updateSession(userId, sessionId, {
      refreshToken: token,
      lastActivityAt: now.toISOString(),
    });
  }

  async getUserSession(userId: number, sessionId: string) {
    return this.deps.usersRepository.getUserSession(userId, sessionId);
  }

  async createUserSession(payload: Pick<UserSession, 'deviceInfo' | 'refreshToken' | 'userId'>) {
    const now = new Date();
    await this.deps.usersRepository.clearStaledSessions(payload.userId);
    return throwIfNotFound(
      this.deps.usersRepository.createSession({
        ...payload,
        sessionId: crypto.randomUUID(),
        lastActivityAt: now.toISOString(),
      }),
    );
  }

  deleteSession(sessionId: string) {
    return this.deps.usersRepository.removeSession(sessionId);
  }

  async getUserSessions(user: RequestUser): Promise<UserSessionResponse[]> {
    const sessions = await this.deps.usersRepository.getSessions(user.id);

    return sessions.map((session) => ({
      id: session.id,
      deviceInfo: session.deviceInfo,
      lastActivityAt: session.lastActivityAt,
      isCurrent: session.sessionId === user.sessionId,
    }));
  }

  terminateSession(id: number) {
    return this.deps.usersRepository.terminateSession(id);
  }

  private async updatePassword(
    user: User,
    payload: Exclude<UpdateUserInput['password'], undefined>,
  ): Promise<void> {
    const isPasswordCorrect = this.deps.hashService.verify(payload.actualPassword, user.password);

    if (!isPasswordCorrect) {
      throw new BadRequestException({ message: 'Incorrect actual password' });
    }

    const hashedPassword = this.deps.hashService.hash(payload.newPassword);

    await throwIfNotFound(
      this.deps.usersRepository.update(user.id, {
        password: hashedPassword,
      }),
    );
  }

  async update(userId: number, data: UpdateUserInput) {
    const user = await throwIfNotFound(this.deps.usersRepository.findByUserIdWithPassword(userId));

    if (data.password) {
      await this.updatePassword(user, data.password);
    }

    return { id: user.id };
  }

  getDisplayData(userId: number) {
    return throwIfNotFound(this.deps.usersRepository.getDisplayData(userId));
  }
}
