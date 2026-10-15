const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Pembungkus fetch ke Delcom Open API.
 * options: { json } untuk body JSON, atau { form } untuk FormData.
 */
export async function apiRequest(method, path, options) {
  const headers = {};
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = { method, headers };
  if (options.json) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.json);
  }
  if (options.form) {
    init.body = options.form;
  }

  const response = await fetch(`${DELCOM_BASEURL}${path}`, init);
  const result = await response.json();

  if (result.status !== "success" && result.success !== true) {
    throw new Error(result.message);
  }
  return result;
}
