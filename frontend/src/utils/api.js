import axios from "axios";

// Adres Twojego backendu (pobierany z .env lub domyślny port 5000)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // KLUCZOWE: pozwala na wysyłanie i odbieranie ciasteczek HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

// --- MECHANIZM ODŚWIEŻANIA TOKENA ---
// Zabezpiecza przed wysłaniem wielu zapytań o odświeżenie naraz
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// --- INTERCEPTOR ODPOWIEDZI ---
api.interceptors.response.use(
  (response) => response, // Jeśli odpowiedź jest ok, po prostu ją zwróć
  async (error) => {
    // 1. Zabezpieczenie przed wyłączonym serwerem (ERR_CONNECTION_REFUSED)
    if (!error.response) {
      console.error("Błąd sieci lub serwer nie odpowiada.");
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 2. Jeśli błąd to 401 (Unauthorized) i nie ponawialiśmy jeszcze tego zapytania
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Jeśli błąd 401 wystąpił podczas logowania lub odświeżania - sesja wygasła
      if (
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      // Jeśli już odświeżamy token, dodaj zapytanie do kolejki oczekujących
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Wywołujemy endpoint odświeżania - backend sam odczyta `refresh_token`
        // z ciastka i nada nam nowy `auth_token`
        await api.post("/auth/refresh");

        processQueue(null);
        isRefreshing = false;

        // Ponawiamy pierwotne zapytanie z nowym ciastkiem
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Jeśli odświeżenie się nie powiodło (np. refresh_token wygasł)
        // Możesz tutaj przekierować na stronę logowania:
        // window.location.href = "/admin/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ==========================================
// ---- GOTOWE ENDPOINTY DO UŻYCIA W APP ----
// ==========================================

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const hamsterApi = {
  getAll: () => api.get("/chomiki"),

  // Ważne: przy wysyłaniu plików musimy podać FormData zamiast zwykłego obiektu
  create: (formData) =>
    api.post("/chomiki", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Wymuszenie nagłówka dla plików
      },
    }),

  update: (id, formData) =>
    api.put(`/chomiki/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => api.delete(`/chomiki/${id}`),
};

export default api;
