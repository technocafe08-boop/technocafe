const SESSION_KEY = "techno-cafe-admin-authed";

export const adminAuth = {
  isLoggedIn(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  },
  login(password: string, correctPassword: string): boolean {
    if (password.length > 0 && password === correctPassword) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  },
  logout(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  },
};
