export const CONTENT = {
  ID: {
    KR: "콘텐츠 식별자",
    INVALID_MESSAGE: "콘텐츠 식별자가 올바르지 않습니다.",
  },

  TITLE: {
    KR: "제목",
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
    REQUIRED_MESSAGE: "제목을 입력해 주세요.",
    MIN_MESSAGE: "제목을 입력해 주세요.",
    MAX_MESSAGE: "제목은 200자 이하로 입력해 주세요.",
  },

  BODY: {
    KR: "본문",
    MIN_LENGTH: 1,
    REQUIRED_MESSAGE: "본문을 입력해 주세요.",
    MIN_MESSAGE: "본문을 입력해 주세요.",
  },

  STATUS: {
    KR: "상태",
  },
} as const;
