import { FetchOptions, HttpVerb, fetch } from "@tauri-apps/api/http";
import { defineStore } from "pinia";
import * as prittier from "prettier";
import { ref } from "vue";
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
  const url = ref("https://google.com");
  const method = ref<HttpVerb>("GET");
  const parameters = ref<Array<Parameter>>([]);
  const headers = ref<Array<Header>>([]);
  const auth = ref<Auth>({ type: "None" });
  const body = ref<Body>({ type: "None" });

  // RESPONSE STATES
  // -> this gets sent back to the UI for display
  const requestPreview = ref<{
    url: string;
    method: HttpVerb;
    parameters: Array<Parameter>;
    headers: Array<Header>;
    auth: Auth;
    body: Body;
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
      parameters: parameters.value,
      headers: headers.value,
      auth: auth.value,
      body: body.value,
    };

    const options: FetchOptions = {
      responseType: 2, // Text
      method: method.value,
      timeout: 10000,
    };

    try {
      // Simulate a delay of 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch(url.value, options);

      // Not sure about this one yet, but hey it works!
      const formated = await prittier.format(response.data as string, {
        parser: "babel",
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
