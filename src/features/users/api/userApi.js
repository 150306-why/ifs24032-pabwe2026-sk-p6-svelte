import { apiRequest } from "../../../helpers/apiHelper.js";

export function getMe() {
  return apiRequest("GET", "/users/me", {});
}

export function getUsers() {
  return apiRequest("GET", "/users", {});
}

export function updateProfile(name, email) {
  return apiRequest("PUT", "/users/me", { json: { name, email } });
}

export function updatePhoto(file) {
  const form = new FormData();
  form.append("photo", file);
  return apiRequest("POST", "/users/photo", { form });
}

export function updatePassword(password, newPassword) {
  return apiRequest("PUT", "/users/password", {
    json: { password, new_password: newPassword },
  });
}
