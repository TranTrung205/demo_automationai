export interface AISession {

  sessionId: string;

  currentTest?: string;

  retryCount: number;

  startedAt: number;

  model?: string;
}

let currentSession: AISession | null = null;

export function startSession(testName: string, model?: string): AISession {

  currentSession = {
    sessionId: Date.now().toString(),
    currentTest: testName,
    retryCount: 0,
    startedAt: Date.now(),
    model
  };

  return currentSession;
}

export function getSession(): AISession | null {
  return currentSession;
}

export function incrementRetry() {
  if (currentSession) {
    currentSession.retryCount++;
  }
}

export function endSession() {
  currentSession = null;
}