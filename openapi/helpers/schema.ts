import _ from "lodash";

interface BasicProperty {
  type: "number" | "integer" | "boolean" | "uuid";
  example?: number | boolean | string;
  required?: boolean;
}

interface StringProperty {
  type: "string";
  example?: string;
  required?: boolean;
  format?: string;
  pattern?: RegExp;
}

interface ObjectProperty {
  type: "object";
  properties: Record<string, Property>;
  required?: boolean;
}

interface ArrayProperty {
  type: "array";
  items: Property;
  required?: boolean;
}

export type Property =
  | BasicProperty
  | StringProperty
  | ObjectProperty
  | ArrayProperty;

type Properties = Record<string, Property>;
export class BaseSchema {
  properties: Properties = {};
  results: Properties = {};
  required: string[];
  name;

  constructor(name: string, properties: Properties) {
    this.name = name;
    this.properties = properties; // Preserve for easier debugging
    this.results = _.cloneDeep(properties);
    this.required = [];
  }

  pick = (fields: string[]) => {
    return this._modify("PICK", fields, (field) => {
      this.results[field] = this.results[field];
    });
  };

  omit = (fields: string[]) => {
    return this._modify("OMIT", fields, (field) => {
      delete this.results[field];
    });
  };

  require = (fields: string[]) => {
    return this._modify(
      "REQUIRE",
      fields.map((f) => `${f}!`),
      () => {}
    );
  };

  add = (field, fieldValue: Property) => {
    const { name, required } = this._parse(field);
    this.results[name] = fieldValue;

    if (required) {
      this.required.push(name);
    }

    return this;
  };

  asProps = () => {
    return {
      type: "object",
      properties: this.results,
      required: this.required,
    };
  };

  // Fields with an ! are required. Remove the ! to ensure the field exists
  _parse = (field) => {
    return {
      name: field.replace("!", ""),
      required: field.split("").reverse()[0] === "!",
    };
  };

  _modify = (action, fields: string[], operation: (field?: string) => void) => {
    fields.forEach((field) => {
      const { name, required } = this._parse(field);
      if (!this.results[name]) {
        throw new Error(
          `${action}: Failed to find property "${name}" on "${this.name}".
          All Properties: ${JSON.stringify(this.properties, null, 2)}
          Available Properties: ${JSON.stringify(this.results, null, 2)}`
        );
      }

      if (required && action !== "OMIT") {
        this.required.push(name);
      }

      operation(name);
    });

    return this;
  };
}

export const Schema = (name: string, properties: Properties) => () =>
  new BaseSchema(name, properties);
