import {
  ArrayProperty,
  IntegerProperty,
  NumberProperty,
  ObjectProperty,
  Property,
  StringProperty,
} from "./types";

export const stringProp = (
  example: string = "Example string",
  other: Partial<StringProperty> = {}
): StringProperty => ({
  ...other,
  type: "string",
  example,
});

export const patternProp = (
  pattern: RegExp,
  example: string,
  other: Partial<StringProperty> = {}
): StringProperty => {
  if (!example.match(pattern)) {
    throw new Error(
      `Pattern/Example mismatch. Pattern: "${pattern}". Example: "${example}".`
    );
  }

  return stringProp(example, { ...other, pattern: pattern.toString() });
};

export const dateProp = (
  example: string = "1970-06-24",
  other: Partial<StringProperty> = {}
): StringProperty => {
  const regex = /\d{4}-\d{2}-\d{2}/;
  if (!example.match(regex)) {
    throw new Error(`Bad date example: "${example}"`);
  }

  return stringProp(example, { ...other, format: "date" });
};

export const datetimeProp = (
  example: string = "1970-06-24T05:34:58Z+01:00",
  other: Partial<StringProperty> = {}
): StringProperty => {
  const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}\d{2}Z\+\d{2}:\d{2}/;
  if (!example.match(regex)) {
    throw new Error(`Bad datetime example: "${example}"`);
  }

  return {
    ...other,
    type: "string",
    format: "date-time",
    example,
  };
};

export const intProp = (
  example: number = 5,
  other: Partial<IntegerProperty> = {}
): IntegerProperty => ({
  ...other,
  type: "integer",
  example,
});

export const floatProp = (
  example: number = 0.5,
  other: Partial<NumberProperty> = {}
): NumberProperty => ({
  ...other,
  type: "number",
  format: "float",
  example,
});

export const arrayProp = (
  item: Property,
  other: Partial<ArrayProperty> = {}
): ArrayProperty => ({
  ...other,
  type: "array",
  items: item,
});

export const objectProp = (
  properties: Record<string, Property>,
  other: Partial<ObjectProperty> = {}
): ObjectProperty => ({
  ...other,
  type: "object",
  properties,
});
