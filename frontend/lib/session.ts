// 仅用于演示页面登录状态；没有 Token，也不构成服务端身份认证。
const SESSION_KEY = "uav-demo-logged-in";

export function isLoggedIn(): boolean {
  return window.localStorage.getItem(SESSION_KEY) === "true";
}

export function setLoggedIn(): void {
  window.localStorage.setItem(SESSION_KEY, "true");
}

export function clearLogin(): void {
  window.localStorage.removeItem(SESSION_KEY);
}
