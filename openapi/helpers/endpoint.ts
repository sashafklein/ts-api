import _ from "lodash";

import {
  Example,
  Param,
  Property,
  ResponseContent,
  RequestContent,
  Responses,
  Examples,
} from "./types";

interface StartingEndpoint {
  name: string;
  description: string;
  tag: "persons";
  parameters?: Param[];
  responses: Responses;
  requestBody?: RequestContent;
}

interface CompleteEndpoint {
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

const generate200Example = (response: ResponseContent): Example => {
  const example = { value: {} };
  const props = response.content["application/json"].schema.properties;

  Object.keys(props).forEach((key) => {
    if (props[key]) {
      example.value[key] = generateExampleFromProperty(props[key]);
    }
  });

  return example;
};

const hasDefaultExample = (response) =>
  response.content["application/json"].examples?.default;

/**
 * Takes a slightly-simplified endpoint API, completes it, and adds a default example if missing.
 * Can also take a function which receives that default example and returns an object defining
 * any other examples (`{ name: Example, ... }`) to add.
 */
export const makeEndpoint = (
  startingEndpoint: StartingEndpoint,
  makeAdditionalExamples?: (example: Example) => Examples
): CompleteEndpoint => {
  const endpoint: CompleteEndpoint = {
    examples: {},
    ..._.pick(startingEndpoint, [
      "description",
      "responses",
      "parameters",
      "requestBody",
      "examples",
    ]),
  };

  const { tag, name } = startingEndpoint;
  const { responses } = endpoint;

  // Enforce only one tag
  endpoint.tags = [tag];

  // Renamed summary to name, to encourage simpler function names
  endpoint.summary = name;

  // Produce the operationId automatically
  endpoint.operationId = _.camelCase(name);

  // Generate a default example
  if (responses[200] && !hasDefaultExample(responses[200])) {
    const defaultExample = generate200Example(responses[200]);

    // Use that default example to generate additional examples based on it
    // If a function to do so is passed.
    let additionalExamples: Examples = {};
    if (makeAdditionalExamples) {
      additionalExamples = makeAdditionalExamples(defaultExample);
    }

    // Attach all examples to the success response
    responses[200].content["application/json"].examples = {
      ...(responses[200].content["application/json"].examples || {}),
      default: defaultExample,
      ...additionalExamples,
    };
  }

  return endpoint;
};
