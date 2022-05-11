/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/people": {
    /** Get data associated with person */
    get: operations["getPerson"];
  };
}

export interface components {
  schemas: {
    Person: {
      /** @example Pam */
      first_name?: string;
      /** @example Halpert */
      last_name?: string;
      ssn?: string;
    };
  };
  responses: {
    $ref: unknown;
  };
  parameters: {
    $ref: unknown;
  };
}

export interface operations {
  /** Get data associated with person */
  getPerson: {
    parameters: {
      path: {
        /** The person's UUID */
        personUuid: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": {
            /** @example success */
            status?: string;
            /** @example Data associated with person. */
            message?: string;
            data?: {
              person?: {
                /** @example Pam */
                first_name?: string;
                /** @example Halpert */
                last_name?: string;
                ssn?: string;
              };
              limitedPerson?: {
                /** @example Pam */
                first_name?: string;
              };
              expandedPerson?: {
                /** @example Pam */
                first_name?: string;
                /** @example Halpert */
                last_name?: string;
                ssn?: string;
                /** @example 25 */
                age: number;
              };
              personWithRequiredSsn?: {
                /** @example Pam */
                first_name?: string;
                /** @example Halpert */
                last_name?: string;
                ssn: string;
              };
              personWithEasyRequires?: {
                /** @example Pam */
                first_name: string;
                /** @example Halpert */
                last_name: string;
                ssn?: string;
              };
            };
          };
        };
      };
      /** Unauthorized */
      401: {
        content: {
          "application/json": {
            /** @example Unauthorized */
            message: string;
          };
        };
      };
      /** Not found */
      404: {
        content: {
          "application/json": {
            /** @example Not found */
            message: string;
          };
        };
      };
    };
  };
}

export interface external {}
