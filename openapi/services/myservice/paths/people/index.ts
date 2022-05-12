import _ from "lodash";
import Person from "@myservice/schemas/Person";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  responses,
} from "@helpers/responses";
import { pathParam } from "@helpers/params";
import { makeEndpoint } from "@helpers/endpoint";

export default {
  get: makeEndpoint({
    name: "getPerson",
    description: "Get data associated with person",
    tag: "persons",
    parameters: [pathParam("personUuid", "uuid", "The person's UUID")],
    responses: responses(
      successResponse({
        status: {
          type: "string",
          example: "success",
        },
        message: {
          type: "string",
          example: "Data associated with person.",
        },
        data: {
          type: "object",
          properties: {
            person: Person().asObject(),
            limitedPerson: Person().omit("ssn", "last_name").asObject(),
            expandedPerson: Person()
              .pick("first_name", "last_name")
              .add("age!", { type: "integer" })
              .asObject(),
            personWithRequiredSsn: Person().require("ssn").asObject(),
            personWithEasyRequires: Person()
              .pick("first_name!", "last_name!")
              .asObject(),
            bunchaPeople: {
              type: "array",
              items: Person().asObject(),
            },
          },
        },
      }),
      unauthorizedResponse(),
      notFoundResponse()
    ),
  }),
};

// (defaultExample) => ({
//   other: _.set(
//     defaultExample,
//     "value.data.bunchaPeople[0].first_name",
//     "Booyah"
//   ),
// })
