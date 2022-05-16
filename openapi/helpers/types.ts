interface BaseProperty<T> {
  type: string;
  enum?: Array<T>;
  example?: T;
  description?: string;
}

export interface BooleanProperty extends BaseProperty<boolean> {
  type: "boolean";
}

export interface NumberProperty extends BaseProperty<number> {
  type: "number";
  minimum?: number;
  maximum?: number;
  format?: "float";
}

export interface IntegerProperty extends BaseProperty<number> {
  type: "integer";
  minimum?: number;
  maximum?: number;
}

type StringFormats = "date" | "date-time" | "byte" | "binary";
export interface StringProperty extends BaseProperty<string> {
  type: "string";
  format?: StringFormats;
  /** A string of a regex pattern **/
  pattern?: string;
}

export interface ObjectProperty extends BaseProperty<Record<string, Property>> {
  type: "object";
  properties: Record<string, Property>;
  required?: string[];
  title?: string; // If a schema
}

export interface ArrayProperty extends BaseProperty<Array<any>> {
  type: "array";
  items: Property;
}

export type Property =
  | BooleanProperty
  | NumberProperty
  | IntegerProperty
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

export interface RequestContent extends ResponseContent {
  required?: boolean;
}

export type Responses = Record<number, ResponseContent>;

// Example types
export type Example = { value: any; description?: string };
export type Examples = Record<string, Example>;
