import { FetchOptions, HttpVerb, fetch } from "@tauri-apps/api/http";
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

  // actually this should not be a ref since it's not reactive
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
    preparePreview();
    requestLoading.value = true;

    requestPreview.value = {
      url: url.value,
      method: method.value,
      parameters: toRaw(parameters.value),
      headers: toRaw(headers.value),
      auth: toRaw(auth.value),
      body: toRaw(body.value),
    };
    console.log(requestPreview.value);

    const options: FetchOptions = {
      responseType: 2, // Text
      method: method.value,
      timeout: 6000,
    };

    try {
      // Simulate a delay of 10 seconds
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch(url.value, options);

      const data = response.data as string;

      // at this point i think i will just use the basic format if this fails...
      // TODO compare no fromat vs my basic format function
      const formated = await prettier
        .format(response.data as string, {
          parser: "html",
          htmlWhitespaceSensitivity: "ignore",
          plugins: [prettierPluginHtml],
        })
        .catch(() => data);

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
  const preparePreview = () => {
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
    preparePreview,
  };
});
