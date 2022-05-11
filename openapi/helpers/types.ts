interface BooleanProperty {
  type: "boolean";
  example?: number | boolean | string;
  description?: string;
}

interface NumberProperty {
  type: "number" | "integer";
  minimum?: number;
  maximum?: number;
  format?: string;
  enum?: number[];
  example?: number;
  description?: string;
}

interface StringProperty {
  type: "string";
  example?: string;
  format?: string;
  pattern?: RegExp;
  enum?: string[];
  description?: string;
}

interface ObjectProperty {
  type: "object";
  properties: Record<string, Property>;
  required?: string[];
  example?: object;
  description?: string;
}

interface ArrayProperty {
  type: "array";
  items: Property;
  example?: any[];
  description?: string;
}

export type Property =
  | BooleanProperty
  | NumberProperty
  | StringProperty
  | ObjectProperty
  | ArrayProperty;

export type Properties = Record<string, Property>;

// Parameter Types

export type ParamSchema = {
  type: ParamType;
  format?: string;
};
export type ParamType = "uuid" | "string" | "integer" | "number";
export interface Param {
  name: string;
  in: "path" | "query";
  required?: boolean;
  schema: ParamSchema;
  description?: string;
}

// Response Types
export type HttpCode = 200 | 400 | 401 | 403 | 404 | 500;

export interface ResponseSchema {
  type: "object";
  properties: Properties;
  required?: string[];
}

export interface ResponseContent {
  description?: string;
  content: {
    "application/json": {
      schema: ResponseSchema;
      examples?: Examples;
    };
  };
}

export type Responses = Record<number, ResponseContent>;

// Example types
export type Example = { value: any; description?: string };
export type Examples = Record<string, Example>;
