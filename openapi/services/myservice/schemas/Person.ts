import { Schema } from "@helpers/schema";
import fields from "../fields";
const { first_name, last_name, ssn } = fields;

const Person = new Schema("Person", {
  first_name,
  middle_name: {
    type: "string",
    example: "M",
  },
  last_name,
  ssn,
});

Person.definePreset("names", ["first_name", "middle_name", "last_name"]);

export default Person;
