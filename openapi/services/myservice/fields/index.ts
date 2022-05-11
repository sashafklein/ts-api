import { Property } from "@helpers/types";
import { loadAllInDir } from "OpenApi/helpers/load";

const fields: Record<string, Property> = loadAllInDir(__dirname);

export default fields;
