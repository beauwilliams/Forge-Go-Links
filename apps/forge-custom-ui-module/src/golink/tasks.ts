import { Link, loadIndex, buildIndex } from './links';
import { getEmail, getRefreshToken, TASK_KEY, UPDATE_TS_KEY } from '../store';

export interface Task {
  type: 'UPDATE';
  progress: number;
  currentPage: number;
  totalPages: number;
  currentLink: number;
  totalLinks: number;
  headers: Headers;
  errorMessage?: string;
  status: 'INIT' | 'RUNNING' | 'DONE' | 'ERROR';
}

export interface TaskSignalMessage {
  type: 'TASK_SIGNAL';
  payload: {
    type: 'UPDATE';
    signal: 'START' | 'STOP';
  };
}

export interface TaskStatusMessage {
  type: 'TASK_STATUS';
  payload: Task;
}

export interface BLinkResponse {
  total: number;
  count: number;
  click_count: number;
  objects: Link[];
  meta: {
    current_page: number;
    previouse_page: number;
    next_page: number;
    last_page: number;
    from: number;
    to: number;
    per_page: number;
    total: number;
    path: string;
  };
}

const sendTaskStatus = (task: Task) => {
  /* chrome.storage.local.set({ [TASK_KEY]: task });
  chrome.runtime
    .sendMessage({
      type: 'TASK_STATUS',
      payload: task,
    } as TaskStatusMessage)
    .catch(() => {
      console.warn("Can't send task status. This might because the popup is closed");
    }); */
};

// Global shared task singleton
export let currentTask: Task | null = null;

let loadedLinks: Link[] = [];

/**
 * Call API to get the Access Token
 */
const getAccessToken = async (email: string, refreshToken: string) => {
  const responseGetToken = await fetch(`https://atlassian.bl.ink/api/v4/access_token`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      refresh_token: refreshToken,
    }),
  });
  const responseGetTokenJson = await responseGetToken.json();
  return 'Bearer ' + responseGetTokenJson.access_token;
};

/**
 * Initiate the task to pull all links from the server
 * @returns Generated task at INIT status
 */
const initUpdateTask = async () => {
  const task = {
    type: 'UPDATE',
    progress: 0,
    currentPage: 0,
    totalPages: 0,
    currentLink: 0,
    totalLinks: 0,
    status: 'INIT',
    headers: new Headers(),
  } as Task;
  try {
    const refreshToken = await getRefreshToken();
    const email = await getEmail();
    const accessToken = await getAccessToken(email, refreshToken);
    const headers = new Headers({
      Authorization: accessToken,
    });
    task.headers = headers;
    const response = await fetch(`https://atlassian.bl.ink/api/v4/1/links?users=all&page=1`, {
      headers: headers,
    });

    if (response.status == 401) {
      task.status = 'ERROR';
      task.errorMessage = 'Invalid refresh token';
      return task;
    }

    const initResponseJson = await response.json();
    loadedLinks = [];
    task.totalLinks = initResponseJson.total;
    task.totalPages = initResponseJson.meta.last_page;
    return task;
  } catch (e) {
    console.error('Error in init task: ', e);
    task.status = 'ERROR';
    return task;
  }
};

/**
 * Pull target page from the server
 * @param curPage page number to fetch
 */

async function pullPage(curPage: number) {
  const response = await fetch(`https://atlassian.bl.ink/api/v4/1/links?users=all&page=${curPage}`, {
    headers: currentTask?.headers,
  });

  const data: BLinkResponse = await response.json();
  let curLinks = data.objects.filter((x) => x.status == 'active' && !x.delete_on && !x.archive_on);
  loadedLinks = loadedLinks.concat(curLinks);
  if (currentTask) {
    currentTask.currentLink = loadedLinks.length;
    currentTask.currentPage += 1;
    currentTask.progress = Math.round((currentTask.currentLink / currentTask.totalLinks) * 100);
    sendTaskStatus(currentTask);
  }
  if (curPage % 20 == 0) {
    console.log(`Loaded ${curPage} pages, found ${loadedLinks.length} links`);
  }
}

/**
 * The main full reload task runner. Will be called by the background script.
 **/
export async function updateLinks() {
  // Initialise task
  const task = await initUpdateTask();
  if (task.status == 'ERROR') {
    sendTaskStatus(task);
    return;
  }
  if (currentTask && currentTask.status == 'RUNNING') {
    throw new Error("Can't start a new task while another is running");
  }
  currentTask = task;

  sendTaskStatus(currentTask);

  // Start task
  console.log('Full reload started');
  task.status = 'RUNNING';
  sendTaskStatus(task);

  const batchs = Array.from(Array(currentTask.totalPages + 1).keys())
    .slice(1)
    .map(async (i) => {
      await pullPage(i);
    });

  await Promise.all(batchs)
    .then(async () => {
      currentTask!.status = 'DONE';
      // chrome.storage.local.set({ [UPDATE_TS_KEY]: Date.now() });
      try {
        await buildIndex(loadedLinks);
        console.log('Full reload finished');
      } catch (e) {
        console.log("Can't build index: ", e);
      }
      sendTaskStatus(currentTask!);
    })
    .catch((e) => {
      console.error(e);
      task.status = 'ERROR';
      sendTaskStatus(task);
    });
}
