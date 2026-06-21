export const URLS = {
  CLIENT: {
    HOME: "/",
    LOGIN: "/login",
    CONTENTS: "/contents",
    USERS: "/users",
  },

  API: {
    AUTH: {
      LOGOUT: "/api/auth/logout",
      GOOGLE: "/api/auth/google",
      GOOGLE_CALLBACK: "/api/auth/google/callback",
      NAVER: "/api/auth/naver",
      NAVER_CALLBACK: "/api/auth/naver/callback",
      KAKAO: "/api/auth/kakao",
      KAKAO_CALLBACK: "/api/auth/kakao/callback",
      OAUTH: (providerId: string) => `/api/auth/${providerId}`,
      OAUTH_CALLBACK: (providerId: string) => `/api/auth/${providerId}/callback`,
    },
  },
} as const;
