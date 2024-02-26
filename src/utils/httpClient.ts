import {
  FetchOptions,
  HttpVerb,
  Body as RequestBody,
  ResponseType,
  fetch,
} from "@tauri-apps/api/http";
import type { Auth, Body, Header, Parameter } from "../types/types";

export const doRequest = async ({
  url,
  method,
  parameters,
  headers,
  auth,
  body,
}: {
  url: string;
  method: HttpVerb;
  parameters: Array<Parameter>;
  headers: Array<Header>;
  auth: Auth;
  body: Body;
}): Promise<{
  preview: {
    url: string;
    method: HttpVerb;
    headers: Record<string, string> | undefined;
    body: RequestBody | undefined;
  };
  status: number;
  headers: Record<string, string>;
  data: string;
}> => {
  const options: FetchOptions = {
    method,
    headers: {},
    responseType: ResponseType.Text,
  };

  //   HEADERS parse
  headers
    .filter((h) => h.checked)
    .forEach((h) => {
      options.headers = {
        ...options.headers,
        [h.name]: h.value,
      };
    });

  // AUTH parse
  switch (auth.type) {
    case "Bearer token":
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${auth.token}`,
      };
      break;
    case "Basic auth":
      options.headers = {
        ...options.headers,
        Authorization: `Basic ${btoa(`${auth.username}:${auth.password}`)}`,
      };
      break;
    case "API key":
      options.headers = {
        ...options.headers,
        [auth.header]: auth.value,
      };
      break;
    default:
      break;
  }

  // BODY parse
  switch (body.type) {
    case "Text":
      if (body.subtype === "JSON") {
        options.headers = {
          ...options.headers,
          "Content-Type": "application/json",
        };
      } else if (body.subtype === "XML") {
        options.headers = {
          ...options.headers,
          "Content-Type": "application/xml",
        };
      }

      options.body = RequestBody.text(body.text);
      break;
    case "File":
      if (body.file === undefined) {
        throw new Error("No file provided.");
      }
      options.body = RequestBody.bytes(
        new Uint8Array(await body.file.arrayBuffer()),
      );
      break;
    case "Form":
      const formData = new FormData();
      body.data
        .filter((d) => d.checked)
        .forEach((d) => {
          if (d.value !== undefined) formData.append(d.key, d.value);
          else if (d.file !== undefined) formData.append(d.key, d.file);
        });
      options.body = RequestBody.form(formData);
      break;
    default:
      break;
  }

  // PARAMETERS parse
  const baseUrl = new URL(url);
  parameters
    .filter((p) => p.checked)
    .forEach((p) => {
      baseUrl.searchParams.append(p.key, p.value);
    });

  const response = await fetch(baseUrl.toString(), options);

  return {
    preview: {
      url: baseUrl.toString(),
      method,
      headers: options.headers,
      body: options.body,
    },
    status: response.status,
    headers: response.headers,
    data: (await response.data) as string,
  };
};
