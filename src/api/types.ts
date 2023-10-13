export interface ListResponseDto<T> {
  total: number;
  data: T[];
}

export class ApiError<T> extends Error {
  options?: T;

  constructor(message: string, options?: T) {
    super(message);
    this.options = options;
  }
}
