const DEFAULT_API_URL = "http://127.0.0.1:8000/api";
const API_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
const AUTH_KEY = "controlalab_auth";

function endpointUrl(endpoint) {
  return `${API_URL}/${endpoint.replace(/^\/+/, "")}`;
}

function backendIndisponivel() {
  return "Backend não disponível neste ambiente. Execute o backend localmente para usar as funcionalidades completas.";
}

async function request(endpoint, options = {}) {
  const headers = options.body
    ? { "Content-Type": "application/json", ...options.headers }
    : options.headers;

  let response;

  try {
    response = await fetch(endpointUrl(endpoint), {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error(backendIndisponivel());
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes("login/")) {
      limparSessao();
      if (!window.location.pathname.endsWith("/login")) {
        window.location.href = `${import.meta.env.BASE_URL}login`;
      }
    }

    throw new Error(data.erro || data.message || "Erro ao comunicar com o backend.");
  }

  return data;
}

export function salvarSessao(dados) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(dados));
}

export function obterSessao() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

export function limparSessao() {
  localStorage.removeItem(AUTH_KEY);
}

export const apiService = {
  get(endpoint) {
    return request(endpoint);
  },

  post(endpoint, body = {}) {
    return request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put(endpoint, body = {}) {
    return request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return request(endpoint, {
      method: "DELETE",
    });
  },
};
