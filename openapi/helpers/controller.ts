import _ from "lodash";

import {
  Example,
  Param,
  Property,
  RequestContent,
  Responses,
  Examples,
} from "./types";

interface StartingController {
  name: string;
  description: string;
  tag: "persons";
  parameters?: Param[];
  responses: Responses;
  requestBody?: RequestContent;
}

export interface CompleteController {
  summary: string;
  operationId: string;
  description: string;
  tags: string[];
  parameters?: Param[];
  responses: Responses;
  requestBody?: RequestContent;
}

const simpleExample = (obj: Property) =>
  ({
    string: "Example string",
    integer: 5,
    number: 4.5,
    boolean: false,
  }[obj.type] || null);

const generateExampleFromProperty = (obj: Property): object => {
  if (obj.type === "object") {
    return Object.keys(obj.properties).reduce((props, key) => {
      return {
        ...props,
        [key]: generateExampleFromProperty(obj.properties[key]),
      };
    }, {});
  }

  if (obj.type === "array") {
    return [generateExampleFromProperty(obj.items)];
  }

  return obj.example || simpleExample(obj);
};

const generate200Example = (content): Example => {
  const example = { value: {} };
  const props = content.schema.properties;

  Object.keys(props).forEach((key) => {
    if (props[key]) {
      example.value[key] = generateExampleFromProperty(props[key]);
    }
  });

  return example;
};

const defaultMapStartingToComplete = (
  controller: StartingController
): CompleteController => {
  const newController = controller as unknown as CompleteController;

  newController.tags = [controller.tag];
  delete controller.tag;

  newController.summary = controller.name;
  newController.operationId = _.camelCase(controller.name);
  delete controller.name;

  return newController;
};

/**
 * Preemptive planning for open-sourcing.
 * Makes it easy for a library user to specify any input format,
 * and a mapping function which produces a functional controller from that input.
 */
const makeController = <T extends unknown>(
  mapStartingToComplete: (controller: T) => CompleteController
) => {
  class SpecifiedController {
    input: T;
    examples: Examples;
    output: CompleteController;
    defaultExample?: Example;
    constructor(input: T, addDefaultExample = true) {
      this.input = input;
      this.output = mapStartingToComplete(_.cloneDeep(this.input));
      if (addDefaultExample) {
        this._addDefaultExample();
      }
    }

    toSpec = () => {
      return this.output;
    };

    addExample = (
      name: string,
      addExampleFunc: (defaultExample: Example) => Example
    ) => {
      const example = addExampleFunc(_.cloneDeep(this.defaultExample));
      this._200Content().examples[name] = example;
      return this;
    };

    _200 = () => {
      const { responses } = this.output;
      return responses[200];
    };

    _200Content = () => {
      return this._200().content["application/json"];
    };

    _addDefaultExample = () => {
      if (!this._200()) return;
      const content = this._200Content();
      let examples = content.examples || {};
      this.defaultExample = examples.default || generate200Example(content);

      content.examples = {
        ...examples,
        default: this.defaultExample,
      };
    };
  }

  return SpecifiedController;
};

export default makeController(defaultMapStartingToComplete);
