const TOKEN_KEY = 'blink-token';
const EMAIL_KEY = 'email';
export const TASK_KEY = 'task';
export const UPDATE_TS_KEY = 'update-ts';

export const getRefreshToken = async () => {
  // const results = await chrome.storage.local.get([TOKEN_KEY]);
  // return results[TOKEN_KEY] ?? '';
  return ''
};

export const saveRefreshToken = async (token: string) => {
  // await chrome.storage.local.set({ [TOKEN_KEY]: token });
};

export const getEmail = async () => {
  // const results = await chrome.storage.local.get([EMAIL_KEY]);
  // return results[EMAIL_KEY] ?? '';
  return ''
};

export const saveEmail = async (email: string) => {
  // await chrome.storage.local.set({ [EMAIL_KEY]: email });
};

export const getTask = async () => {
  // const results = await chrome.storage.local.get([TASK_KEY]);
  // return results[TASK_KEY] ?? null;
  return ''
};

export const getUpdateTS = async () => {
  // const results = await chrome.storage.local.get([UPDATE_TS_KEY]);
  // return results[UPDATE_TS_KEY] ?? 'N/A';
return 'N/A'
};

export const saveShowConfig = async (showConfig: boolean) => {
  // await chrome.storage.local.set({ showConfig });
};

export const getShowConfig = async () => {
  // const results = await chrome.storage.local.get(['showConfig']);
  // return results['showConfig'] ?? true;
  return true
};
