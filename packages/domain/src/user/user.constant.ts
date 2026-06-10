export const USER = {
  ID: {
    KR: "사용자 식별자",
    INVALID_MESSAGE: "사용자 식별자가 올바르지 않습니다.",
  },

  EMAIL: {
    KR: "이메일",
    MAX_LENGTH: 255,
    INVALID_MESSAGE: "올바른 이메일 형식이 아닙니다.",
  },

  NAME: {
    KR: "이름",
    MAX_LENGTH: 100,
    MAX_MESSAGE: "이름은 100자 이하로 입력해 주세요.",
  },

  AVATAR_URL: {
    KR: "프로필 이미지 URL",
    INVALID_MESSAGE: "프로필 이미지 URL 형식이 올바르지 않습니다.",
  },

  NICKNAME: {
    KR: "닉네임",
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REQUIRED_MESSAGE: "닉네임을 입력해 주세요.",
    MIN_MESSAGE: "닉네임은 2자 이상 입력해 주세요.",
    MAX_MESSAGE: "닉네임은 50자 이하로 입력해 주세요.",
    INVALID_MESSAGE: "닉네임은 한글, 영문, 숫자, 밑줄만 사용할 수 있습니다.",
    PATTERN: /^[가-힣a-zA-Z0-9_]+$/,
  },

  ROLE: {
    KR: "권한",
  },

  STATUS: {
    KR: "상태",
  },
} as const;
