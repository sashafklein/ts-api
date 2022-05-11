export const pathParam = (
  name: string,
  type: "uuid" | "string",
  description
) => ({
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
