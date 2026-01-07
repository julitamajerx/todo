import { APIRequestContext, test, expect } from "@playwright/test";

const apiUrl = "https://todo-te3m.onrender.com/api/";

export async function loginApi(request: APIRequestContext) {
  const loginURL = apiUrl + "user/login";
  const response = await request.post(loginURL, {
    data: {
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    },
  });

  expect(response.status()).toBe(200);

  return response;
}

test.describe("Api e2e gets test", () => {
  test.beforeEach(async ({ request }) => {
    await loginApi(request);
  });

  test("Get all tasks for the user", async ({ request }) => {
    const response = await request.get(apiUrl + "tasks");
    const resonseObj = await response.json();
    console.log(resonseObj);
  });

  test("Get all tags for the user", async ({ request }) => {
    const response = await request.get(apiUrl + "tags?all=true");
    const resonseObj = await response.json();
    console.log(resonseObj);
  });

  test("Get all lists for the user", async ({ request }) => {
    const response = await request.get(apiUrl + "lists?all=true");
    const resonseObj = await response.json();
    console.log(resonseObj);
  });
});

test.describe("Api e2e posts test", () => {
  test.beforeEach(async ({ request }) => {
    await loginApi(request);
  });

  test("Add task for the user", async ({ request }) => {
    const testTask = {
      description: "",
      dueDate: Date.now(),
      isCompleted: false,
      isDeleted: false,
      name: `New task ${Date.now()}`,
    };

    const response = await request.post(apiUrl + "tasks/create", {
      data: testTask,
    });

    const resonseObj = await response.json();
    console.log(resonseObj);
  });

  test("Add tag for the user", async ({ request }) => {
    const testTag = { emoji: "😀", name: `New tag ${Date.now()}` };

    const response = await request.post(apiUrl + "tags/create", {
      data: testTag,
    });

    const resonseObj = await response.json();
    console.log(resonseObj);
  });

  test("Add list for the user", async ({ request }) => {
    const testList = { name: `New list ${Date.now()}`, isPinned: false };

    const response = await request.post(apiUrl + "lists/create", {
      data: testList,
    });

    const resonseObj = await response.json();
    console.log(resonseObj);
  });
});
