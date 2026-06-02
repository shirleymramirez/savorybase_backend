import crypto from "crypto";

type Session = {
  userId: string;
  lastActivityAt: number;
};

type CreateSessionInput = {
  userId: string;
  now?: number;
};

type TouchSessionInput = {
  sessionId: string;
  idleTimeoutMs: number;
  now?: number;
};

type DeleteExpiredSessionsInput = {
  idleTimeoutMs: number;
  now?: number;
};

type TouchSessionResult =
  | {
      valid: true;
      session: Session;
    }
  | {
      valid: false;
      reason: "missing" | "expired";
    };

const sessions = new Map<string, Session>();

const createSession = ({ userId, now = Date.now() }: CreateSessionInput): string => {
  const sessionId = crypto.randomUUID();

  sessions.set(sessionId, {
    userId,
    lastActivityAt: now
  });

  return sessionId;
};

const touchSession = ({ sessionId, idleTimeoutMs, now = Date.now() }: TouchSessionInput): TouchSessionResult => {
  const session = sessions.get(sessionId);

  if (!session) {
    return { valid: false, reason: "missing" };
  }

  if (now - session.lastActivityAt > idleTimeoutMs) {
    sessions.delete(sessionId);
    return { valid: false, reason: "expired" };
  }

  session.lastActivityAt = now;
  sessions.set(sessionId, session);

  return { valid: true, session };
};

const deleteExpiredSessions = ({ idleTimeoutMs, now = Date.now() }: DeleteExpiredSessionsInput): void => {
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivityAt > idleTimeoutMs) {
      sessions.delete(sessionId);
    }
  }
};

export {
  createSession,
  touchSession,
  deleteExpiredSessions
};
