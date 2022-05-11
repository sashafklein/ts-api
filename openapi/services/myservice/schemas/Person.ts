import { Schema } from "OpenApi/helpers/schema";
import fields from "../fields";
const { firstName, lastName, ssn } = fields;

export default Schema("Person", {
  first_name: firstName,
  last_name: lastName,
  ssn: ssn,
});
