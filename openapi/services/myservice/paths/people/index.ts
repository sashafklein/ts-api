import _ from "lodash";
import Person from "@myservice/schemas/Person";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  responses,
} from "@helpers/responses";
import { pathParam } from "@helpers/params";
import Controller from "@helpers/controller";
import { Property } from "@helpers/types";
import { validatePathSpec } from "@helpers/path";

const data: Property = {
  type: "object",
  properties: {
    person: Person().toSpec(),

    limitedPerson: Person().omit("ssn", "last_name").toSpec(),

    expandedPerson: Person()
      .pick("first_name", "last_name")
      .add("age!", { type: "integer", example: 25 })
      .toSpec(),

    personWithRequiredSsn: Person().require("ssn").toSpec(),

    personWithEasyRequires: Person().pick("first_name!", "last_name!").toSpec(),

    bunchaPeople: {
      type: "array",
      items: Person().toSpec(),
    },
  },
};

export default validatePathSpec({
  get: new Controller({
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
        data,
      }),
      unauthorizedResponse(),
      notFoundResponse()
    ),
  })
    .addExample("other", (def) =>
      _.set(def, "value.data.bunchaPeople[0].first_name", "Booyah")
    )
    .toSpec(),
});
