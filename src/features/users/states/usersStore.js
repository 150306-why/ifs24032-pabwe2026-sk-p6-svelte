import { writable } from "svelte/store";
import {
  getMe,
  getUsers,
  updatePassword,
  updatePhoto,
  updateProfile,
} from "../api/userApi.js";
import { profile } from "../../auth/states/authStore.js";
import { attempt, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const users = writable([]);

async function notify(ok, message) {
  if (ok) {
    await showSuccessDialog(message);
  }
  return ok;
}

export async function fetchUsers() {
  await attempt(async () => {
    const result = await getUsers();
    users.set(result.data.users);
  });
}

export async function saveProfile(name, email) {
  const ok = await attempt(async () => {
    await updateProfile(name, email);
    profile.update((current) => ({ ...current, name, email }));
  });
  return notify(ok, "Profil berhasil diubah");
}

export async function savePhoto(file) {
  const ok = await attempt(async () => {
    await updatePhoto(file);
    const me = await getMe();
    profile.set(me.data.user);
  });
  return notify(ok, "Foto profil berhasil diubah");
}

export async function savePassword(password, newPassword) {
  const ok = await attempt(() => updatePassword(password, newPassword));
  return notify(ok, "Kata sandi berhasil diubah");
}
