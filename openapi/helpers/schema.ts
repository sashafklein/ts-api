import _ from "lodash";

import { Properties, Property } from "./types";
/**
 * A class for tracking and modifying properties of any "domain object" (eg Person).
 * Generally created using the Schema helper function (below):
 *   Schema('Person', { ...properties }).pick('one', 'two').toSpec()
 * The `toSpec` function is required when integrating into a spec
 * to return openapi-friendly properties.
 */
export class BaseSchema {
  allProperties: Properties = {};
  selected: Properties = {};
  required: string[];
  name: string;

  constructor(name: string, properties: Properties) {
    this.name = name;
    this.allProperties = properties; // Preserve for easier debugging
    this.selected = _.cloneDeep(properties);
    this.required = [];
  }

  /**
   * Select the fields to return when calling toSpec.
   */
  pick = (...fields: string[]) => {
    return this._modify("PICK", fields, (field) => {
      this.selected[field] = this.selected[field];
    });
  };

  /**
   * Exclude fields to return when calling toSpec.
   */
  omit = (...fields: string[]) => {
    return this._modify("OMIT", fields, (field) => {
      delete this.selected[field];
    });
  };

  /**
   * Add to the list of required field returned from toSpec.
   */
  require = (...fields: string[]) => {
    return this._modify(
      "REQUIRE",
      fields.map((f) => `${f}!`),
      () => {}
    );
  };

  /**
   * Add a single field. Note that this field must be an openapi property, with a type, etc.
   */
  add = (field, fieldValue: Property) => {
    const { name, required } = this._parse(field);
    this.selected[name] = fieldValue;

    if (required) {
      this.required.push(name);
    }

    return this;
  };

  /**
   * Return all the properties selected, as an openapi property object.
   */
  toSpec = () => {
    return {
      type: "object" as "object",
      properties: this.selected,
      required: this.required,
      title: this.name,
    };
  };

  /**
   * Parse a field string, returning the base field "name", and
   * whether the field is required (if it ends in a !).
   */
  _parse = (field) => {
    return {
      name: field.replace("!", ""),
      required: field.split("").reverse()[0] === "!",
    };
  };

  /**
   * Helper function for "selecting" properties and marking some as required.
   */
  _modify = (action, fields: string[], operation: (field?: string) => void) => {
    fields.forEach((field) => {
      const { name, required } = this._parse(field);
      if (!this.selected[name]) {
        throw new Error(
          `${action}: Failed to find property "${name}" on "${this.name}".
          All Properties: ${JSON.stringify(this.allProperties, null, 2)}
          Selected Properties: ${JSON.stringify(this.selected, null, 2)}`
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

/**
 *
 * @param name Schema Name (eg Person)
 * @param properties List of properties to fill the schema with
 * @returns A new Schema class instance.
 */
export const Schema = (name: string, properties: Properties) => () =>
  new BaseSchema(name, properties);
