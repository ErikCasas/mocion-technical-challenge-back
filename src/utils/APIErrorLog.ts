import { APIError } from "../models/APIError";

export const logApiError = (apiError: APIError): void => {
  if (apiError instanceof APIError) {
    if (apiError.severity === "info") {
      console.info(apiError.message, apiError.data);
    } else if (apiError.severity === "warning") {
      console.warn(apiError.message, apiError.data);
    } else {
      console.error(apiError.message, apiError.data);
    }
  } else {
    console.error(apiError);
  }
};
