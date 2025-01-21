import { APIErrorType } from "../types/openai";

const errorCodeToType: { [code: number]: APIErrorType } = {
  400: "BadRequestError",
  401: "AuthenticationError",
  403: "PermissionDeniedError",
  404: "NotFoundError",
  422: "UnprocessableEntityError",
  429: "RateLimitError",
};

function getErrorType(
  errorCode: number | undefined
): APIErrorType | "InternalServerError" {
  return errorCode ? errorCodeToType[errorCode] : "InternalServerError";
}

export { getErrorType };
