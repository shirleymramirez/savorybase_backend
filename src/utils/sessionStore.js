const crypto = require("crypto");

const sessions = new Map();

const createSession = ({ userId, now = Date.now() }) => {
  const sessionId = crypto.randomUUID();

  sessions.set(sessionId, {
    userId,
    lastActivityAt: now
  });

  return sessionId;
};

const touchSession = ({ sessionId, idleTimeoutMs, now = Date.now() }) => {
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

const deleteExpiredSessions = ({ idleTimeoutMs, now = Date.now() }) => {
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivityAt > idleTimeoutMs) {
      sessions.delete(sessionId);
    }
  }
};

module.exports = {
  createSession,
  touchSession,
  deleteExpiredSessions
};
