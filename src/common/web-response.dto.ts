export class WebResponse<T> {
  success: boolean;
  data?: T | T[];
  paging?: Pagging;
  errors?: string | string[];
}

export class Pagging {
  size: number;
  total_page: number;
  current_page: number;
}