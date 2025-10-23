import { AxiosError } from "axios";

export function handleAxiosError(err: any) {
  let message = "An unexpected error occurred.";
  let fieldErrors: Record<string, string[]> = {};

  if (err.response) {
    const data = err.response.data;
    message = data.message || message;

    if (data.errors && typeof data.errors === "object") {
      Object.keys(data.errors).forEach((field) => {
        fieldErrors[field] = data.errors[field];
      });
    } else if (data.message) {
      fieldErrors["general"] = [data.message];
    }
  } else if (err.request) {
    message = "No response from server. Please check your internet connection.";
  } else {
    message = err.message || message;
  }

  return { message, fieldErrors };
}
