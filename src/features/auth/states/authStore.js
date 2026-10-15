import { get, writable } from "svelte/store";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from "../../../helpers/apiHelper.js";
import { login, register } from "../api/authApi.js";
import { getMe } from "../../users/api/userApi.js";

export const token = writable(getAccessToken());
export const profile = writable(null);
export const ready = writable(false);

export function logout() {
  removeAccessToken();
  profile.set(null);
  token.set(null);
}

export async function initAuth() {
  if (get(token)) {
    try {
      const result = await getMe();
      profile.set(result.data.user);
    } catch {
      logout();
    }
  }
  ready.set(true);
}

export async function doLogin(email, password) {
  const result = await login(email, password);
  const newToken = result.data.token;
  putAccessToken(newToken);
  const me = await getMe();
  profile.set(me.data.user);
  token.set(newToken);
}

export async function doRegister(name, email, password) {
  await register(name, email, password);
}
