import _ from "lodash";

import { Properties, Property } from "./types";
/**
 * A class for tracking and modifying properties of any "domain object" (eg Person).
 * Generally created using the Schema helper function (below):
 *   Schema('Person', { ...properties }).all().pick('one', 'two').toSpec()
 * The `toSpec` function is required when integrating into a spec
 * to return openapi-friendly properties.
 */
export class Schema {
  allProperties: Properties = {};
  selected: Properties = {};
  required: string[];
  name: string;
  presets: Record<string, string[]> = {};

  constructor(name: string, properties: Properties) {
    this.name = name;
    this.allProperties = properties;
    this.selected = {};
    this.required = [];
  }

  /**
   * Add to the list of presets associated with this schema.
   * A preset is just a list of fields that can be easily accessed at once:
   *   Schema.definePreset('basic', ['first_name', 'last_name']);
   *   Schema.selectPreset('basic') // Picks first and last name
   */
  definePreset = (name: string, list: string[]) => {
    list.forEach((field) => {
      if (!this.allProperties[field]) {
        throw new Error(
          `\nFailed defining preset "${name}" for Schema "${this.name}". Field "${field}" does not exist.\n`
        );
      }
    });

    this.presets[name] = list;
    return this;
  };

  /**
   * Set selected to be all fields.
   */
  all = () => {
    this.selected = _.cloneDeep(this.allProperties);
    return this;
  };

  /**
   * Set selected to be all fields defined in given preset.
   */
  preset = (name: string) => {
    if (!this.presets[name]) {
      throw new Error(
        `\nPreset "${name}" not found for Schema "${this.name}".\n`
      );
    }

    return this.all().pick(...this.presets[name]);
  };

  /**
   * Select specific fields *among those already selected*.
   */
  pick = (...fields: string[]) => {
    const newSelected = {};
    this._modify("PICK", fields, (field) => {
      newSelected[field] = this.selected[field];
    });
    this.selected = newSelected;
    return this;
  };

  /**
   * Exclude specific fields *from those already selected*.
   */
  omit = (...fields: string[]) => {
    return this._modify("OMIT", fields, (field) => {
      delete this.selected[field];
    });
  };

  /**
   * Declare which of the already selected fields are required.
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
   * Simultaneously, resets selected properties to all properties,
   * so that the next call to the class is unaffected.
   */
  toSpec = () => {
    if (Object.entries(this.selected).length === 0) {
      throw new Error(
        `\nAttempted to convert empty ${this.name} to spec. Did you forget to call \`${this.name}.all()\`?\n`
      );
    }
    const spec = {
      type: "object" as "object",
      properties: this.selected,
      required: this.required,
      title: this.name,
    };

    this.selected = {};
    this.required = [];

    return spec;
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
          `\n${action}: Failed to find property "${name}" on "${this.name}".\n
          All Props:\n\n${JSON.stringify(this.allProperties, null, 2)}\n
          Selected Props:\n\n${JSON.stringify(this.selected, null, 2)}\n`
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
