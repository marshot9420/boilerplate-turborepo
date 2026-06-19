export const URLS = {
  CLIENT: {
    HOME: "/",
    LOGIN: "/login",
    CONTENTS: "/contents",
    CONTENTS_DETAIL: (contentId: string) => `/contents/${contentId}`,
    MY_PAGE: "/me",
  },

  API: {
    AUTH: {
      LOGOUT: "/api/auth/logout",
      GOOGLE: "/api/auth/google",
      NAVER: "/api/auth/naver",
      KAKAO: "/api/auth/kakao",
      OAUTH: (providerId: string) => `/api/auth/${providerId}`,
      OAUTH_CALLBACK: (providerId: string) => `/api/auth/${providerId}/callback`,
    },
  },
} as const;
