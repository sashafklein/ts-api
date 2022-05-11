import Person from "@myservice/schemas/Person";
import { successJson, unauthorized, notFound } from "@helpers/responses";
import { pathParam } from "@helpers/params";
import { makeEndpoint } from "@helpers/endpoint";
import { Responses } from "@helpers/types";

const result = {
  get: makeEndpoint({
    summary: "getPerson",
    description: "Get data associated with person",
    tag: "persons",
    parameters: [pathParam("personUuid", "uuid", "The person's UUID")],
    responses: {
      ...successJson({
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
            limitedPerson: Person().omit(["ssn", "last_name"]).asObject(),
            expandedPerson: Person()
              .pick(["first_name", "last_name"])
              .add("age!", { type: "integer" })
              .asObject(),
            personWithRequiredSsn: Person().require(["ssn"]).asObject(),
            personWithEasyRequires: Person()
              .pick(["first_name!", "last_name!"])
              .asObject(),
          },
        },
      }),
      ...unauthorized(),
      ...notFound(),
    },
  }),
};

export default result;
