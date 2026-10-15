import { apiRequest } from "../../../helpers/apiHelper.js";

export function login(email, password) {
  return apiRequest("POST", "/auth/login", { json: { email, password } });
}

export function register(name, email, password) {
  return apiRequest("POST", "/auth/register", {
    json: { name, email, password },
  });
}
