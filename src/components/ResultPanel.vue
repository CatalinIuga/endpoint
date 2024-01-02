<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useStore } from "../store/store";
import { coloredHttpMethod, coloredHttpStatus } from "../utils/coloring";
import BodyViewer from "./Highlighting/BodyViewer.vue";

const selectedTab = ref("Request");

const store = useStore();
const {
  method,
  responsePreview,
  requestPreview,
  requestLoading,
  requestError,
} = storeToRefs(store);

const url = computed(() => {
  if (requestPreview.value?.url) {
    return new URL(requestPreview.value.url).origin;
  }
  return "";
});

// TODO this is just wrong ....
const path = computed(() => {
  const url = requestPreview.value?.url;
  if (!url) return "";
  const path = new URL(url).pathname;
  const params = requestPreview.value?.parameters;
  if (params) {
    const paramKeys = Object.keys(params);
    if (paramKeys.length > 0) {
      return `${path}?${paramKeys
        .map((key) => `${key}=${params[key as keyof typeof params]}`)
        .join("&")}`;
    }
  }
  return path;
});
</script>

<template>
  <!-- Tabs -->
  <div
    class="flex w-full justify-between border-b-[1px] border-primary border-opacity-5 px-2 py-2"
  >
    <div class="flex gap-[2px] text-xs text-ternary">
      <button
        :disabled="!requestPreview"
        class="relative flex items-center gap-2 rounded-lg px-4 py-2"
        :class="[
          selectedTab === 'Request' && requestPreview !== null
            ? 'bg-selected text-primary hover:bg-selected'
            : '',
          requestPreview === null
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-hovered',
        ]"
        @click="selectedTab = 'Request'"
      >
        Request
        <span
          v-if="requestPreview"
          class="font-bold"
          :class="[coloredHttpMethod(method)]"
        >
          {{ method }}
        </span>
      </button>
      <button
        :disabled="!responsePreview"
        class="relative flex items-center gap-2 rounded-lg px-4 py-2"
        :class="[
          selectedTab === 'Response' && responsePreview !== null
            ? 'bg-selected text-primary hover:bg-selected'
            : '',
          responsePreview === null
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-hovered',
        ]"
        @click="selectedTab = 'Response'"
      >
        Request
        <span
          v-if="responsePreview"
          class="font-extrabold"
          :class="[coloredHttpStatus(responsePreview.status)]"
        >
          {{ responsePreview.status }}
        </span>
      </button>
    </div>
    <button
      @click="store.resetPreview"
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
  <div v-if="requestError" class="flex h-full w-full items-center">
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

  <!-- Request&Response Viewers -->
  <div class="h-full w-full overflow-y-auto">
    <div v-if="selectedTab === 'Request'" class="p-2">
      <!-- METHOD, PATH, STATUS VIEWER -->
      <div class="flex items-center gap-2 font-bold">
        <span class="font-extrabold" :class="[coloredHttpMethod(method)]">
          {{ requestPreview?.method }}
        </span>
        <span class="text-ternary">{{ url }}</span>
        <span class="text-primary">
          {{ path }}
        </span>
      </div>

      <!-- HEADERS VIEWER -->
      <div class="flex flex-col gap-2">
        <div v-for="header in requestPreview?.headers" class="">
          <span class="text-ternary">{{ header.name }}:</span>
          <span class="text-primary">{{ header.value }}</span>
        </div>
      </div>
    </div>

    <!-- RESPONSE VIEWER -->
    <div v-else="selectedTab === 'Response'" class="h-full w-full p-2">
      <iframe
        v-if="responsePreview"
        class="h-full w-full"
        sandbox="allow-scripts"
        :srcdoc="
          `<base href='${requestPreview!.url}' />` + responsePreview.body
        "
      />
      <BodyViewer v-if="responsePreview" />
    </div>
  </div>
</template>
