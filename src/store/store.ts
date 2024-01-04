import {
  FetchOptions,
  HttpVerb,
  ResponseType,
  fetch,
} from "@tauri-apps/api/http";
// @ts-expect-error -> Deno clears this!
import prettierPluginHtml from "https://unpkg.com/prettier@3.1.1/plugins/html.mjs";
import { defineStore } from "pinia";
import prettier from "prettier/standalone";
import { ref, shallowRef, toRaw } from "vue";
import {
  type Auth,
  type Body,
  type Header,
  type Parameter,
} from "../types/types";
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

  // RESPONSE STATES
  // -> this gets sent back to the UI for display
  const requestPreview = shallowRef<{
    url: string;
    method: HttpVerb;
    parameters: Array<Parameter>; // filter this
    headers: Array<Header>; // filter this
    auth: Auth; // filter this
    body: Body; // filter this
  } | null>(null);

  const responsePreview = ref<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
  } | null>(null);

  const requestLoading = ref(false);
  const requestError = ref("");

  // #YOLO
  const sendRequest = async () => {
    clearPreview();
    requestLoading.value = true;

    // TODO: filter out the parameters, headers, auth and body
    // -> that are not selected by the user
    // TODO: fix again for when the component is not mounted
    // and the user modified the request
    requestPreview.value = {
      url: url.value,
      method: method.value,
      parameters: toRaw(parameters.value),
      headers: toRaw(headers.value),
      auth: toRaw(auth.value),
      body: toRaw(body.value),
    };

    const options: FetchOptions = {
      responseType: ResponseType.Text,
      method: method.value,
      timeout: 6000,
    };

    try {
      // Simulate a delay of 10 seconds
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(url.value, options);

      const data = response.data as string;

      const formated = await prettier
        .format(response.data as string, {
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

      responsePreview.value = {
        status: response.status,
        statusText: statusText(response.status),
        headers: response.headers,
        body: formated,
      };
    } catch (err: any) {
      requestError.value = err.message;
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
