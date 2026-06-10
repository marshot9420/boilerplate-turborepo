export type SortDirection = "asc" | "desc";

export interface ListQuery<TSortKey extends string = string> {
  page?: number;
  limit?: number;
  keyword?: string;
  sortKey?: TSortKey;
  sortDirection?: SortDirection;
}
