import PeoplePath from "MyService/paths/people";
import Schemas from "MyService/schemas";

export default {
  openapi: "3.0.0",
  info: {
    title: "API",
    version: "2.0.0",
  },
  paths: {
    "/api/people": PeoplePath,
  },
  components: {
    schemas: Schemas,
    responses: {
      $ref: "components/responses/index.js",
    },
    parameters: {
      $ref: "components/parameters/index.js",
    },
  },
  servers: [
    {
      url: "{protocol}://localhost:{port}",
      description: "Local development server",
      variables: {
        port: {
          enum: ["3030", "4010"],
          default: "3030",
        },
        protocol: {
          enum: ["https", "http"],
          default: "https",
        },
      },
    },
  ],
};
