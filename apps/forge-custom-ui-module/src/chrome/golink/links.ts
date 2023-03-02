import Fuse from 'fuse.js';
import xmlescape from 'xml-escape';

const LINKS_INDEX_STORAGE_KEY = 'links-index';
const LINKS_DATA_STORAGE_KEY = 'link-links-data';

export interface Link {
  id: number;
  url: string;
  alias: string;
  short_link: string;
  created: number;
  modifiend: number;
  user_id: number;
  domain_id: number;
  click_count: number;
  notify_on_click: string;
  notes: string;
  redirect_type: number;
  status: string;
  template_id: any;
  delete_on: any;
  archive_on: any;
  groups: any[];
}

const options = {
  isCaseSensitive: false,
  keys: ['alias', 'url'],
};

let linksIndex = null;
let linksData: Link[] | null = null;
let fuse: Fuse<Link> | null = null;

export const buildIndex = async (links: Link[]) => {
  /* const startTime = new Date();
  linksIndex = Fuse.createIndex(options.keys, links);
  const linksIndexJson = linksIndex.toJSON();
  await chrome.storage.local.set({
    [LINKS_INDEX_STORAGE_KEY]: linksIndexJson,
    [LINKS_DATA_STORAGE_KEY]: links,
  });
  console.log('Index saved in ' + (new Date().valueOf() - startTime.valueOf()) + 'ms');
  loadIndex(); */
};

export const loadIndex = async () => {
  const startTime = new Date();
  /* const result = await chrome.storage.local.get([LINKS_INDEX_STORAGE_KEY, LINKS_DATA_STORAGE_KEY]);

  if (result[LINKS_INDEX_STORAGE_KEY] && result[LINKS_DATA_STORAGE_KEY]) {
    console.log('Loading index from storage');
    linksIndex = Fuse.parseIndex<Link>(result[LINKS_INDEX_STORAGE_KEY]);
    linksData = result[LINKS_DATA_STORAGE_KEY];
    fuse = new Fuse(result[LINKS_DATA_STORAGE_KEY], options, linksIndex);
  } else {
    console.log('Index not found in storage.');
    buildIndex([]);
  }
  console.log('Index loaded in ' + (new Date().valueOf() - startTime.valueOf()) + 'ms'); */
};

export const getSuggestions = (query: string) => {
  if (fuse) {
    return fuse.search(query, { limit: 10 }).map((result) => {
      const item = result.item;
      return {
        content: item.alias,
        description: `<match> ${item.alias} </match> <dim> - ${xmlescape(item.url)} </dim>`,
      };
    });
  } else {
    return [];
  }
};

export const queryGolink = (url: string) => {
  if (linksData) {
    return linksData.find((link) => link.url === url);
  }
  return null;
};
