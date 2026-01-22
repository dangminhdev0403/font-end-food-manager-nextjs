export interface ApiResponse<T> {
  data: T;
}

export class ApiError<T = any> extends Error {
  status: number;
  error: string | null;
  data: T | null;

  constructor({
    status,
    message,
    error = null,
    data = null,
  }: {
    status: number;
    message: string;
    error?: string | null;
    data?: T | null;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.error = error;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
