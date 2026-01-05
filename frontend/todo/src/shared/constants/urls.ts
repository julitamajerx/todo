const BASE_URL = 'http://localhost:5000';

export const TASKS_URL = BASE_URL + '/api/tasks';
export const TASK_BY_URL = TASKS_URL + '/';
export const TASK_URL_CREATE = TASKS_URL + '/create';
export const TASK_URL_DELETE = TASKS_URL + '/delete';
export const TASK_URL_COMPLETE = TASKS_URL + '/complete';
export const TASK_URL_UPDATE = TASKS_URL + '/update';
export const TASK_URL_RECOVER = TASKS_URL + '/recover';

export const TAGS_URL = BASE_URL + '/api/tags';
export const TAGS_URL_CREATE = TAGS_URL + '/create';
export const TAGS_URL_DELETE = TAGS_URL + '/delete';

export const LISTS_URL = BASE_URL + '/api/lists';
export const LISTS_URL_CREATE = LISTS_URL + '/create';
export const LISTS_URL_DELETE = LISTS_URL + '/delete';

export const USER_URL = BASE_URL + '/api/user';
export const USER_LOGIN_URL = USER_URL + '/login';
export const USER_LOGOUT_URL = USER_URL + '/logout';
export const USER_REGISTER_URL = USER_URL + '/register';
