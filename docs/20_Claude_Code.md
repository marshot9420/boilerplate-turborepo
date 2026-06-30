# Claude Code Guide

## 목적

이 프로젝트는 Claude Code로 작업하기 쉽도록 다음 파일을 제공합니다.

```txt
CLAUDE.md
CLAUDE.local.example.md
.claude/settings.json
.claude/agents/*
.claude/skills/*
```

## 처음 사용할 때

```bash
claude
```

Claude Code 안에서 다음을 확인합니다.

```txt
/memory
/permissions
/agents
```

## CLAUDE.md

프로젝트 공통 지침입니다.

포함 내용:

- 프로젝트 구조
- 패키지 책임
- 의존성 방향
- 테스트 명령어
- 코딩 규칙
- 금지 사항

## 개인 설정

개인 설정은 `CLAUDE.local.md`에 작성합니다.

```bash
cp CLAUDE.local.example.md CLAUDE.local.md
```

`CLAUDE.local.md`는 커밋하지 않습니다.

## 권한 설정

공유 권한은 `.claude/settings.json`에 둡니다.

개인 권한은 `.claude/settings.local.json`에 둡니다.

## 추천 작업 흐름

### 새 기능 구현

```txt
/implement-feature
```

### 테스트 작성

```txt
/write-tests
```

### 코드 리뷰

```txt
/review-code
```

### 문서 업데이트

```txt
/update-docs
```

## 주의사항

Claude가 다음 작업을 하려고 하면 반드시 사람이 확인합니다.

- 의존성 추가
- DB migration 생성
- DB push/migrate
- lockfile 수정
- git commit
- 배포 관련 작업
