const USER_ID_KEY = "writing-app-user-id";

export function getUserId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}
