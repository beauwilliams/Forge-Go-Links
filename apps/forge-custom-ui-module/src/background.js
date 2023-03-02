'use strict';

import { getSuggestions, queryGolink, loadIndex } from './golink/links';
import { updateLinks, currentTask } from './golink/tasks';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

chrome.omnibox.onInputEntered.addListener((text) => {
  var newURL = 'https://go.atlassian.com/' + encodeURI(text);
  chrome.tabs.update(undefined, { url: newURL });
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if (!text) return;
  const suggestion = getSuggestions(text);
  suggest(suggestion);
});

// go links downloading event Map
const taskSignalEventMap = {
  UPDATE: {
    START: updateLinks,
    STOP: async () => {},
  },
};

// Search for go links when tabs updated or created
const updateBadge = (tabId, url) => {
  const golink = queryGolink(url);
  if (golink) {
    chrome.action.setBadgeText({ tabId: tabId, text: golink.alias });
  } else {
    chrome.action.setBadgeText({ tabId: tabId, text: '' });
  }
};

const queryCurrentGolink = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return queryGolink(tabs[0].url);
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  updateBadge(tabId, tab.url);
});

chrome.tabs.onCreated.addListener(function (tab) {
  updateBadge(tab.id, tab.url);
});

// Message handler for popup and contentScript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case 'TASK_SIGNAL':
      const payload = request.payload;
      taskSignalEventMap[payload.type][payload.signal]();
      sendResponse({ ack: true });
      break;
    case 'QUERY_GOLINK':
      queryCurrentGolink().then((golink) => {
        sendResponse({
          ack: true,
          golink: golink,
        });
      });
      break;
    case 'PULL_STATUS':
      sendResponse({
        ack: true,
        task: currentTask,
      });
      break;
    case 'TASK_STATUS':
      // Swallow
      break;
    default:
      console.error('Unkown request type: ' + request.type);
  }
  return true;
});

// Initialise the extension
loadIndex();
