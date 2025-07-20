export class WebResponse<T> {
  success: boolean;
  data?: T | T[];
  errors?: string | string[];
}
