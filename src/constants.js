export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DONE: 'done'
};

export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const X_REQUEST_ID_KEY = 'X-Request-ID';

export const VALID_TASK_STATUSES = Object.values(TASK_STATUS);
