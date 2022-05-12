import { CompleteController } from "./controller";

interface PathSpec {
  get?: CompleteController;
  put?: CompleteController;
  patch?: CompleteController;
  post?: CompleteController;
  delete?: CompleteController;
}

export const validatePathSpec = (pathSpec: PathSpec) => pathSpec;
