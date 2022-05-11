import Person from "MyService/schemas/Person";
import { successJson, unauthorized, notFound } from "OpenApi/helpers/responses";
import { pathParam } from "OpenApi/helpers/params";

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
            person: Person().result(),
            limitedPerson: Person().omit(["ssn", "last_name"]).result(),
            expandedPerson: Person()
              .pick(["first_name", "last_name"])
              .add("age!", { type: "integer", example: 25 })
              .result(),
            personWithRequiredSsn: Person().require(["ssn"]).result(),
            personWithEasyRequires: Person()
              .pick(["first_name!", "last_name!"])
              .result(),
          },
        },
      }),
      ...unauthorized(),
      ...notFound(),
    },
  },
};

export default result;
