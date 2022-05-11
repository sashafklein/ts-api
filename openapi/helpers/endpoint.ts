import _ from "lodash";
import { Example, Param, Property, ResponseContent, Responses } from "./types";

interface StartingEndpoint {
  summary: string;
  description: string;
  tag: "persons";
  parameters?: Param[];
  responses: Responses;
  requestBody?: any;
}

interface CompleteEndpoint {
  summary: string;
  operationId: string;
  description: string;
  tags: string[];
  parameters?: Param[];
  responses: Responses;
  requestBody?: any;
}

const simpleExample = (obj) =>
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
 * Takes a slightly-simplified endpoint API, completes it, and adds a default example if missing
 */
export const makeEndpoint = (
  startingEndpoint: StartingEndpoint
): CompleteEndpoint => {
  const endpoint: CompleteEndpoint = {
    examples: {},
    ..._.pick(startingEndpoint, [
      "summary",
      "description",
      "responses",
      "parameters",
      "requestBody",
      "examples",
    ]),
  };

  const { tag, summary } = startingEndpoint;
  const { responses } = endpoint;

  // Enforce only one tag
  endpoint.tags = [tag];

  // Produce the operationId automatically
  endpoint.operationId = _.camelCase(summary);

  if (responses[200] && !hasDefaultExample(responses[200])) {
    responses[200].content["application/json"].examples = {
      ...(responses[200].content["application/json"].examples || {}),
      default: generate200Example(responses[200]),
      other: _.set(
        generate200Example(responses[200]),
        "value.data.bunchaPeople[0].first_name",
        "Booyah"
      ),
    };
  }

  return endpoint;
};
