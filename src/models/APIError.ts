type Severity = "error" | "warning" | "info";

export class APIError extends Error {
  data: Record<string, any>;
  severity: Severity;

  constructor(message: string, data: Record<string, any>, severity?: Severity) {
    super(message);
    this.name = "APIError";
    this.data = data;
    this.severity = severity || "error";
  }
}
