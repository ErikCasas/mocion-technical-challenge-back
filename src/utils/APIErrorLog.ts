import { APIError } from "../models/APIError";

export const logApiError = (apiError: APIError): void => {
  if (apiError instanceof APIError) {
    if (apiError.severity === "info") {
      // eslint-disable-next-line no-console
      console.info(apiError.message, apiError.data);
    } else if (apiError.severity === "warning") {
      // eslint-disable-next-line no-console
      console.warn(apiError.message, apiError.data);
    } else {
      // eslint-disable-next-line no-console
      console.error(apiError.message, apiError.data);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error(apiError);
  }
};
