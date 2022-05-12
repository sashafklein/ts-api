import PersonSchema from "./Person";

export default {
  Person: PersonSchema().toSpec(),
};
