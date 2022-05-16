import { stringProp } from "@helpers/props";
import { Schema } from "@helpers/schema";
import { ssn } from "../fields";

const Person = new Schema("Person", {
  first_name: stringProp("Pam"),
  middle_name: stringProp("M"),
  last_name: stringProp("Halpert"),
  ssn,
});

Person.definePreset("names", ["first_name", "middle_name", "last_name"]);

export default Person;
