import { HttpCode, Properties, Responses, ResponseSchema } from "./types";

export const content = (schema: ResponseSchema, description?: string) => ({
  description,
  content: {
    "application/json": {
      schema,
    },
  },
});

const response = (
  code: HttpCode,
  schema: ResponseSchema,
  description?: string
): Responses => ({
  [code]: content(schema, description),
});

export const responses = (...resps: Responses[]): Responses =>
  resps.reduce((obj, resp) => ({ ...obj, ...resp }), {});

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

export const successResponse = (properties: Properties) =>
  response(200, { type: "object", properties });

export const badRequestResponse = () =>
  response(400, errorSchema("Bad request"), "Bad request");

export const unauthorizedResponse = () =>
  response(401, errorSchema("Unauthorized"), "Unauthorized");

export const forbiddenResponse = () =>
  response(403, errorSchema("Forbidden"), "Forbidden");

export const notFoundResponse = () =>
  response(404, errorSchema("Not found"), "Not found");
