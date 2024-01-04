<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useStore } from "../store/store";
import { coloredHttpMethod, coloredHttpStatus } from "../utils/coloring";

import XIcon from "../assets/svg/x.svg";
import ReadonlyViewer from "./Highlighting/ReadonlyViewer.vue";

// ICONS
import LoadingIcon from "../assets/svg/loading.svg";

const selectedTab = ref("Request");
const previewHtml = ref(false);

const store = useStore();
const { responsePreview, requestPreview, requestLoading, requestError } =
  storeToRefs(store);

const path = () => {
  if (requestPreview.value) {
    let url = new URL(requestPreview.value.url);
    const params = requestPreview.value.parameters
      .filter((param) => param.checked && param.key !== "")
      .map((param) => `${param.key}=${param.value}`)
      .join("&");
    url.search = params ? url.search + "&" + params : url.search;
    return url.pathname + url.search;
  }
  return "";
};
</script>

<template>
  <!-- TABS -->
  <div
    class="-ml-2 flex w-[calc(100%+8px)] justify-between border-b-[1px] border-primary border-opacity-5 px-2 py-2"
  >
    <div class="flex gap-[2px] text-xs text-ternary">
      <!-- REQUEST -->
      <button
        class="relative flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-hovered"
        :class="[
          selectedTab === 'Request' && requestPreview !== null
            ? 'bg-selected text-primary hover:bg-selected'
            : '',
        ]"
        @click="selectedTab = 'Request'"
      >
        Request

        <!-- REQUEST METHOD -->
        <span
          v-if="requestPreview"
          class="font-bold"
          :class="[coloredHttpMethod(requestPreview.method)]"
        >
          {{ requestPreview.method }}
        </span>
      </button>

      <!-- RESULT -->
      <button
        class="relative flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-hovered"
        :class="[
          selectedTab === 'Response' && responsePreview !== null
            ? 'bg-selected text-primary hover:bg-selected'
            : '',
        ]"
        @click="selectedTab = 'Response'"
      >
        Request

        <!-- RESPONSE LOADING -->
        <span v-if="requestLoading" class="font-bold text-primary">
          <div v-html="LoadingIcon" class="size-2 animate-spin text-primary" />
        </span>

        <!-- RESPONSE STATUS CODE -->
        <span
          v-if="responsePreview"
          class="font-extrabold"
          :class="[coloredHttpStatus(responsePreview.status)]"
        >
          {{ responsePreview.status }}
        </span>
      </button>
    </div>

    <!-- CLEAR BUTTON -->
    <button
      v-if="requestPreview"
      @click="store.clearPreview"
      class="rounded-md px-2 text-xs hover:bg-hovered"
    >
      clear
    </button>
  </div>

  <!-- Error Message -->
  <div v-if="requestError" class="flex h-full w-full items-center">
    <div class="flex flex-col items-center justify-center text-red-500">
      <div class="size-10" v-html="XIcon" />
      <p class="text-sm">{{ requestError }}</p>
    </div>
  </div>

  <!-- PLACEHOLDER -->
  <div
    v-if="!requestLoading && !requestPreview"
    class="flex h-full w-full items-center justify-center"
  >
    No request sent yet...
  </div>

  <!-- Request&Response Viewers -->
  <div v-else class="h-full w-full overflow-y-auto">
    <!-- REQUEST VIEWER -->
    <div v-if="selectedTab === 'Request' && requestPreview" class="p-2">
      <!-- METHOD, PATH, STATUS VIEWER -->
      <div class="flex items-center gap-2 font-bold">
        <div
          class="font-extrabold"
          :class="[coloredHttpMethod(requestPreview.method)]"
        >
          {{ requestPreview?.method }}
        </div>
        <div class="overflow-hidden break-words text-primary">
          {{ path() }}
        </div>
        <div class="text-ternary opacity-80">HTTP/1.1</div>
      </div>

      <!-- HEADERS VIEWER -->
      <div class="flex flex-col gap-2">
        <div v-for="header in requestPreview?.headers" class="">
          <span class="text-ternary">{{ header.name }}:</span>
          <span class="text-primary">{{ header.value }}</span>
        </div>
      </div>
      <pre>
        {{ JSON.stringify(requestPreview, null, 4) }}
      </pre>
    </div>

    <!-- RESPONSE VIEWER -->
    <div v-else="selectedTab === 'Response'" class="h-full w-full py-2 pr-2">
      <!-- Loading Spinner -->
      <div
        v-if="requestLoading"
        class="flex h-full w-full items-center justify-center"
      >
        <div v-html="LoadingIcon" class="size-10 animate-spin text-primary" />
      </div>
      <iframe
        v-if="responsePreview && previewHtml"
        class="h-full w-full rounded-md"
        sandbox="allow-scripts allow-same-origin"
        :srcdoc="`<base href='${requestPreview?.url}'>` + responsePreview.body"
      />
      <ReadonlyViewer v-else-if="responsePreview" />
    </div>
  </div>

  <!-- Menu -->
  <div
    class="h-15 -ml-2 flex w-[calc(100%+8px)] items-center justify-between gap-3 border-t-[1px] border-primary border-opacity-5 p-3 text-xs"
  >
    <!-- Preview toggle for HTML -->
    <button
      @click="previewHtml = !previewHtml"
      class="relative flex items-center justify-between gap-2 rounded-xl fill-current px-2 py-1 text-sm"
    >
      <span
        class="left-0 inline-block h-5 w-9 rounded-3xl shadow-sm transition-transform"
        :class="[previewHtml ? 'bg-green-400' : 'bg-bg4']"
      ></span>
      <span
        class="absolute left-3 inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform"
        :class="{
          'translate-x-3': previewHtml,
          'bg-bg': previewHtml,
          'bg-primary': !previewHtml,
        }"
      ></span>
      <span class="text-sm text-primary">Preview</span>
    </button>
    <!-- Submenu or something... -->
    <button class="rounded-md text-sm hover:bg-hovered">...</button>
  </div>
</template>
