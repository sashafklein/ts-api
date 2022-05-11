import Person from "@myservice/schemas/Person";
import { successJson, unauthorized, notFound } from "@helpers/responses";
import { pathParam } from "@helpers/params";

const result = {
  get: {
    summary: "getPerson",
    operationId: "getPerson",
    description: "Get data associated with person",
    tags: ["persons"],
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
              .add("age!", { type: "integer", example: 25 })
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
  },
};

export default result;
