/* eslint-disable @typescript-eslint/no-explicit-any */
type HTTPErrorOptions = {
  status?: number;
  message?: string;
  code?: number;
  error?: any;
};

export class HTTPError extends Error {
  status: number;
  code: number | undefined = undefined;
  error: any;

  constructor({ status, message, code, error }: HTTPErrorOptions) {
    super(message);
    this.message = message ?? "Internal Server Error";
    this.status = status ?? 500;
    this.code = code;
    this.error = error;
  }
}
