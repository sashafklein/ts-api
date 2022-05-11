import { Schema } from "@helpers/schema";
import fields from "../fields";
const { first_name, last_name, ssn } = fields;

export default Schema("Person", {
  first_name,
  last_name,
  ssn,
});
