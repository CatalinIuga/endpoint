/**
 * Parameter is a key-value pair that can be sent in the body of a request.
 * The checked field is used to determine if the parameter should be sent.
 */
export type Parameter = {
  checked: boolean;
  key: string;
  value: string;
};

/**
 * Header are basically parameters with a different name.
 * The checked field is used to determine if the header should be sent.
 */
export type Header = {
  checked: boolean;
  name: string;
  value: string;
};

/**
 * Auth has 4 types of values:
 * - None
 * - Basic
 * - Bearer
 * - API Key
 *
 * Depending on the type, the following fields are required:
 * - None: none
 * - Basic: username, password -> Authorization: Basic <base64(username:password)>
 * - Bearer: token -> Authorization: Bearer <token>
 * - API Key: key, value -> is basically a header
 *
 */
export type Auth =
  | { type: "None" }
  | { type: "Basic auth"; username: string; password: string }
  | { type: "Bearer token"; token: string }
  | { type: "API key"; header: string; value: string };

/**
 * Body types:
 * - None
 * - Form data
 *  - multipart/form-data
 *  - application/x-www-form-urlencoded
 * - Text
 *  - Raw
 *  - JSON
 *  - XML
 *  - YAML
 * - Binary data -> file
 */
export type Body =
  | { type: "None" }
  | {
      type: "Text";
      subtype: "Raw" | "JSON" | "XML";
      text: string;
    }
  | { type: "Form"; multipart: boolean; data: CustomFormData[] }
  | { type: "File"; file: File | undefined };

type CustomFormData = {
  checked: boolean;
  key: string;
  value?: string;
  file?: File;
};
