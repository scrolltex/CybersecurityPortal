export interface PaginatedViewModel<T> {
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  items: T[];
}
