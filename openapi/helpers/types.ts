interface BooleanProperty {
  type: "boolean";
  example?: number | boolean | string;
}

interface NumberProperty {
  type: "number" | "integer";
  minimum?: number;
  maximum?: number;
  format?: string;
  enum?: number[];
  example?: number;
}

interface StringProperty {
  type: "string";
  example?: string;
  format?: string;
  pattern?: RegExp;
  enum?: string[];
}

interface ObjectProperty {
  type: "object";
  properties: Record<string, Property>;
  required?: string[];
}

interface ArrayProperty {
  type: "array";
  items: Property;
}

export type Property =
  | BooleanProperty
  | NumberProperty
  | StringProperty
  | ObjectProperty
  | ArrayProperty;

export type Properties = Record<string, Property>;
