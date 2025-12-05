const BASE_URL = 'http://localhost:5000';

export const TASKS_URL = BASE_URL + '/api/tasks';
export const TASK_BY_URL = TASKS_URL + '/';
export const TASKS_TODAY_URL = TASKS_URL + '/today';
export const TASKS_WEEK_URL = TASKS_URL + '/week';
export const TASKS_DELETED_URL = TASKS_URL + '/deleted';
export const TASKS_BY_TAG_URL = TASKS_URL + '/tag/'; // + tagName
export const TASKS_BY_LIST_URL = TASKS_URL + '/list/'; // + listName

export const TAGS_URL = BASE_URL + '/api/tags';
export const LISTS_URL = BASE_URL + '/api/lists';
