export type ContentStatus = "PUBLISHED" | "HIDDEN" | "DELETED";

export interface ContentDetailResponse {
  id: string;
  title: string;
  content: string;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentResponse {
  id: string;
  title: string;
  status: ContentStatus;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
