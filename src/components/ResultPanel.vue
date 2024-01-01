<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useStore } from "../store/store";
import BodyViewer from "./Highlighting/BodyViewer.vue";

const tabs = ["Request", "Response"];
const selectedTab = ref("Request");

const store = useStore();
const {
  auth,
  body,
  method,
  parameters,
  headers,
  url,
  requestError,
  responseBody,
  requestLoading,
  responseHeaders,
} = storeToRefs(store);

const request = computed(() =>
  JSON.stringify(
    {
      auth: auth.value,
      body: body.value,
      method: method.value,
      parameters: parameters.value,
      headers: headers.value,
      url: url.value,
    },
    null,
    4,
  ),
);
</script>

<template>
  <div
    class="flex w-full justify-between border-b-[1px] border-primary border-opacity-5 px-2 py-2"
  >
    <div class="flex gap-[2px] text-xs text-ternary">
      <button
        :disabled="responseBody === ''"
        v-for="tab in tabs"
        class="relative flex items-center rounded-lg px-4 py-2"
        :class="[
          selectedTab === tab && responseBody !== ''
            ? 'bg-selected text-primary hover:bg-selected'
            : '',
          responseBody === ''
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-hovered',
        ]"
        @click="selectedTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <button
      @click="store.resetResponseStates"
      class="rounded-md pb-2 hover:bg-hovered"
    >
      ...
    </button>
  </div>

  <!-- Loading Spinner -->
  <div
    v-if="requestLoading"
    class="flex h-full w-full items-center justify-center"
  >
    <svg
      class="size-10 animate-spin text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  </div>

  <!-- Error Message -->
  <div v-else-if="requestError" class="flex h-full w-full items-center">
    <div class="flex flex-col items-center justify-center">
      <svg
        class="size-10 text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 14.828l4.243 4.243 1.414-1.414L13.414 13l4.243-4.243-1.414-1.414L12 11.172 7.757 6.929 6.343 8.343 10.586 12l-4.243 4.243 1.414 1.414L12 14.828z"
        />
      </svg>
      <p class="text-sm text-red-500">{{ requestError }}</p>
    </div>
  </div>

  <!-- Response Body -->
  <div v-else class="h-full w-full overflow-y-auto">
    <pre v-if="selectedTab === 'Request'" class="p-2">{{ request }}</pre>
    <div v-else="selectedTab === 'Response'" class="h-full w-full p-2">
      <!-- <iframe
        class="h-full w-full"
        sandbox="allow-scripts"
        :srcdoc="`<base href='${url}' />` + responseBody"
      /> -->
      <pre>
        {{ responseHeaders }}
      </pre>
      <BodyViewer />
    </div>
  </div>
</template>
