import { FetchOptions, HttpVerb, fetch } from "@tauri-apps/api/http";
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  type Auth,
  type Body,
  type Header,
  type Parameter,
} from "../types/types";

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
  const requestSent = ref(false);
  const requestLoading = ref(false);
  const requestError = ref("");
  const responseBody = ref("");
  const responseHeaders = ref<Record<string, string>>({});

  // #YOLO
  const sendRequest = async () => {
    requestSent.value = true;
    resetResponseStates();

    const options: FetchOptions = {
      responseType: 2,
      method: method.value,
      timeout: 10000,
    };

    await fetch(url.value, options)
      .then((res) => {
        responseBody.value = res.data as string;
        responseHeaders.value = res.headers;
      })
      .catch((err) => {
        requestError.value = err;
        console.log(err);
      });

    requestLoading.value = false;
  };

  // HELPERS
  const resetResponseStates = () => {
    requestSent.value = false;
    requestLoading.value = true;
    requestError.value = "";
    responseBody.value = "";
    responseHeaders.value = {};
  };

  return {
    responseBody,
    requestSent,
    responseHeaders,
    requestError,
    requestLoading,
    url,
    method,
    parameters,
    headers,
    auth,
    body,
    resetResponseStates,
    sendRequest,
  };
});
