import { HttpVerb, Body as RequestBody } from "@tauri-apps/api/http";
// @ts-expect-error
import prettierPluginHtml from "https://unpkg.com/prettier@3.1.1/plugins/html.mjs";
import { defineStore } from "pinia";
import prettier from "prettier/standalone";
import { ref, shallowRef, watch } from "vue";
import {
  type Auth,
  type Body,
  type Header,
  type Parameter,
} from "../types/types";
import { doRequest } from "../utils/httpClient";
import { statusText } from "../utils/statusText";

export const useStore = defineStore("crld", () => {
  // REQUEST STATES
  // -> this handles the user input
  const url = ref("https://example.com");
  const method = ref<HttpVerb>("GET");
  const parameters = ref<Array<Parameter>>([]);
  const headers = ref<Array<Header>>([]);
  const auth = ref<Auth>({ type: "None" });
  const body = ref<Body>({ type: "None" });

  watch(
    () => auth.value.type,
    (newType: string, oldType: string) => {
      if (newType === oldType) return;

      if (newType === "None") {
        auth.value = {
          type: "None",
        };
      } else if (newType === "Basic auth") {
        auth.value = {
          type: "Basic auth",
          username: "",
          password: "",
        };
      } else if (newType === "Bearer token") {
        auth.value = {
          type: "Bearer token",
          token: "",
        };
      } else if (newType === "API key") {
        auth.value = {
          type: "API key",
          header: "",
          value: "",
        };
      } else {
        auth.value = {
          type: "None",
        };
      }
    },
  );

  watch(
    () => body.value.type,
    (newType: string, oldType: string) => {
      if (newType === oldType) return;

      if (newType === "Form") {
        body.value = {
          type: "Form",
          data: [],
          multipart: false,
        };
      } else if (newType === "Text") {
        body.value = {
          type: "Text",
          subtype: "Raw",
          text: "",
        };
      } else if (newType === "File") {
        body.value = {
          type: "File",
          file: undefined,
        };
      } else {
        body.value = {
          type: "None",
        };
      }
    },
  );

  // RESPONSE STATES
  // -> this gets sent back to the UI for display
  const requestPreview = shallowRef<{
    url: string;
    method: HttpVerb;
    headers: Record<string, string> | undefined;
    body: RequestBody | undefined;
  } | null>(null);

  const responsePreview = ref<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
    size?: number;
    executionTime?: number;
    sentAt?: string;
  } | null>(null);

  const requestLoading = ref(false);
  const requestError = ref("");

  // #YOLO
  const sendRequest = async () => {
    clearPreview();
    requestLoading.value = true;

    try {
      // Simulate a delay of 10 seconds
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      // time the request
      const START = performance.now();

      const {
        preview,
        status,
        headers: responseHeaders,
        data,
      } = await doRequest({
        url: url.value,
        method: method.value,
        parameters: parameters.value,
        headers: headers.value,
        auth: auth.value,
        body: body.value,
      });

      requestPreview.value = {
        url: preview.url,
        method: preview.method,
        headers: preview.headers,
        body: preview.body,
      };

      const END = performance.now();

      const formated = await prettier
        .format(data as string, {
          parser: "html",
          htmlWhitespaceSensitivity: "ignore",
          plugins: [prettierPluginHtml],
        })
        // prittier formater is great but can fail for basic syntax errors...
        // -> so if it fails we just return the data as is
        .catch((err) => {
          console.error("Prettier failed to format the response: ", err);
          return data;
        });

      // map the response to the responsePreview
      responsePreview.value = {
        status: status,
        statusText: statusText(status),
        headers: responseHeaders,
        body: formated,
        size: data.length,
        executionTime: END - START,
        sentAt: new Date().toISOString(),
      };
    } catch (err: any) {
      requestError.value = "Could not complete the request.";
    } finally {
      requestLoading.value = false;
    }
  };

  // HELPERS
  const clearPreview = () => {
    requestLoading.value = false;
    requestError.value = "";
    requestPreview.value = null;
    responsePreview.value = null;
  };

  return {
    requestPreview,
    requestError,
    requestLoading,
    responsePreview,
    url,
    method,
    parameters,
    headers,
    auth,
    body,
    sendRequest,
    clearPreview,
  };
});
