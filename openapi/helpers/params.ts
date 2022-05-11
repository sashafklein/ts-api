import { Param, ParamSchema, ParamType } from "./types";

const schemas: Record<ParamType, ParamSchema> = {
  uuid: {
    type: "string",
    format: "uuid",
  },
  string: { type: "string" },
  integer: { type: "integer" },
  number: { type: "number" },
};

export const pathParam = (
  name: string,
  type: ParamType,
  description
): Param => ({
  name,
  in: "path",
  required: true,
  schema:
    type === "uuid"
      ? {
          type: "string",
          format: "uuid",
        }
      : { type: "string" },
  description,
});

export const queryParam = (
  name: string,
  type: "uuid" | "string",
  description
): Param => ({
  name,
  in: "query",
  required: false,
  schema: schemas[type],
  description,
});
