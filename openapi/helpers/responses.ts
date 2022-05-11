import { HttpCode, ResponseContent, Responses, ResponseSchema } from "./types";

const response = (
  code: HttpCode,
  schema: ResponseSchema,
  description?: string
): Responses => ({
  [code]: {
    description,
    content: {
      "application/json": {
        schema,
      },
    },
  },
});

const errorSchema = (example = "Error in backend"): ResponseSchema => ({
  type: "object",
  properties: {
    message: {
      type: "string",
      example,
    },
  },
  required: ["message"],
});

export const successJson = (properties) =>
  response(200, { type: "object", properties });

export const badRequest = () =>
  response(400, errorSchema("Bad request"), "Bad request");

export const unauthorized = () =>
  response(401, errorSchema("Unauthorized"), "Unauthorized");

export const forbidden = () =>
  response(403, errorSchema("Forbidden"), "Forbidden");

export const notFound = () =>
  response(404, errorSchema("Not found"), "Not found");
