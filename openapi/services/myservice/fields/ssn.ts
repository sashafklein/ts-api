import { patternProp } from "@helpers/props";

export const ssn = patternProp(/^\d{9}$/, "123456789");
