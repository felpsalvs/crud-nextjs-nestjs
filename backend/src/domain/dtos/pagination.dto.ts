export class PaginationDto {
  page: number = 1;
  limit: number = 10;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}