import _ from "lodash";
import JSON from "node-json-color-stringify";

import { Properties, Property } from "./types";
/**
 * A class for tracking and modifying properties of any "domain object" (eg Person).
 * Generally created using the Schema helper function (below):
 *   Schema('Person', { ...properties }).all().pick('one', 'two').toSpec()
 * The `toSpec` function is required when integrating into a spec
 * to return openapi-friendly properties.
 */
export class Schema<PropType extends Properties> {
  allProperties: Record<keyof PropType, Property> = {} as PropType;
  selected: Record<keyof PropType, Property> = {} as PropType;
  required: Array<keyof PropType>;
  name: string;
  presets: Record<string, Array<keyof PropType>> = {};

  constructor(name: string, properties: PropType) {
    this.name = name;
    this.allProperties = properties;
    this.selected = {} as PropType;
    this.required = [];
  }

  /**
   * Add to the list of presets associated with this schema.
   * A preset is just a list of fields that can be easily accessed at once:
   *   Schema.definePreset('basic', ['first_name', 'last_name']);
   *   Schema.selectPreset('basic') // Picks first and last name
   */
  definePreset = (name: string, list: Array<keyof PropType>) => {
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
  pick = (
    ...fields: Array<keyof PropType | `${Extract<keyof PropType, string>}!`>
  ) => {
    const newSelected = {};
    this._modify("PICK", fields, (field) => {
      newSelected[field] = this.selected[field];
    });
    this.selected = newSelected as PropType;
    return this;
  };

  /**
   * Exclude specific fields *from those already selected*.
   */
  omit = (
    ...fields: Array<keyof PropType | `${Extract<keyof PropType, string>}!`>
  ) => {
    return this._modify("OMIT", fields, (field) => {
      delete this.selected[field];
    });
  };

  /**
   * Declare which of the already selected fields are required.
   */
  require = (
    ...fields: Array<keyof PropType | `${Extract<keyof PropType, string>}!`>
  ) => {
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
    const { name, required } = this._parse(field) as {
      name: keyof PropType;
      required: boolean;
    };
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
        `\nAttempted to call \`toSpec\` on empty ${this.name}. Did you forget to call \`${this.name}.all()\`?\n`
      );
    }
    const spec = {
      type: "object" as "object",
      properties: this.selected,
      required: this.required,
      title: this.name,
    };

    this.selected = {} as PropType;
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
  _modify = (
    action,
    fields: Array<keyof PropType | `${Extract<keyof PropType, string>}!`>,
    operation: (field?: string) => void
  ) => {
    // No modifications can occur on empty schemas.
    // If the schema is empty, raise a useful error.
    if (Object.entries(this.selected).length === 0) {
      const fieldString = fields.map((f) => `'${f}'`).join(", ");
      throw new Error(
        `\nAttempted to call ${action.toLowerCase()}(${
          fieldString.length > 50 ? "..." : fieldString
        }) on empty ${this.name}. Did you forget to first call \`all()\`?\n`
      );
    }

    fields.forEach((field) => {
      const { name, required } = this._parse(field);
      if (!this.selected[name]) {
        throw new Error(
          `\n${action}: Failed to find property "${name}" on "${this.name}".
          \nAll Props:\n\n${JSON.colorStringify(this.allProperties, null, 2)}
          \nSelected Props:\n\n${JSON.colorStringify(this.selected, null, 2)}\n`
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
