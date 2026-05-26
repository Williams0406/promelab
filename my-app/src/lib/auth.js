/**
 * ============================
 * TOKEN STORAGE
 * ============================
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";
const ACCESS_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 3;

/**
 * ============================
 * BASIC HELPERS
 * ============================
 */
const isBrowser = () => typeof window !== "undefined";

const setAccessTokenCookie = (token) => {
  if (!isBrowser()) return;

  document.cookie = [
    `access_token=${token}`,
    "path=/",
    `Max-Age=${ACCESS_TOKEN_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
};

const clearAccessTokenCookie = () => {
  if (!isBrowser()) return;
  document.cookie = "access_token=; Max-Age=0; path=/; SameSite=Lax";
};

export const getAccessToken = () =>
  isBrowser() ? localStorage.getItem(ACCESS_TOKEN_KEY) : null;

export const getRefreshToken = () =>
  isBrowser() ? localStorage.getItem(REFRESH_TOKEN_KEY) : null;

export const setTokens = ({ access, refresh }) => {
  if (!isBrowser()) return;
  if (access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    setAccessTokenCookie(access);
  }
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearTokens = () => {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  clearAccessTokenCookie();
};

/**
 * ============================
 * USER HELPERS
 * ============================
 */
export const setUser = (user) => {
  if (!isBrowser()) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  if (!isBrowser()) return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getAccessToken();

/**
 * ============================
 * ROLE HELPERS
 * ============================
 */
export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const isAdmin = () => ["ADMIN"].includes(getUserRole());
export const isStaff = () => ["ADMIN", "STAFF"].includes(getUserRole());
export const isClient = () => getUserRole() === "CLIENT";

/**
 * ============================
 * LOGOUT
 * ============================
 */
export const logout = () => {
  clearTokens();
  if (isBrowser()) window.location.href = "/login";
};
