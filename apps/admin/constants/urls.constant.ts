export const URLS = {
  CLIENT: {
    HOME: "/",
    LOGIN: "/login",
    MY_PAGE: "/me",
  },

  API: {
    AUTH: {
      LOGOUT: "/api/auth/logout",
      GOOGLE: "/api/auth/google",
      NAVER: "/api/auth/naver",
      KAKAO: "/api/auth/kakao",
    },
  },
} as const;
