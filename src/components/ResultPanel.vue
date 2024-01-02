<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
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
</script>

<template>
  <!-- Tabs -->
  <div
    class="flex w-full justify-between border-b-[1px] border-primary border-opacity-5 px-2 py-2"
  >
    <div class="flex gap-[2px] text-xs text-ternary">
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
        <span
          v-if="requestPreview"
          class="font-bold"
          :class="[coloredHttpMethod(method)]"
        >
          {{ method }}
        </span>
      </button>

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
        <span v-if="requestLoading" class="font-bold text-primary">
          <svg
            class="size-2 animate-spin text-primary"
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
        </span>

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
      @click="store.preparePreview"
      class="rounded-md pb-2 hover:bg-hovered"
    >
      ...
    </button>
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
    <!-- PLACEHOLDER -->
    <div
      v-if="!requestLoading && !requestPreview"
      class="flex h-full w-full items-center justify-center"
    >
      No request sent yet...
    </div>

    <!-- REQUEST VIEWER -->
    <div v-if="selectedTab === 'Request' && requestPreview" class="p-2">
      <!-- METHOD, PATH, STATUS VIEWER -->
      <div class="flex items-center gap-2 font-bold">
        <div class="font-extrabold" :class="[coloredHttpMethod(method)]">
          {{ requestPreview?.method }}
        </div>
        <div class="overflow-hidden break-words text-primary">
          {{ requestPreview?.url }}
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
    </div>

    <!-- RESPONSE VIEWER -->
    <div v-else="selectedTab === 'Response'" class="h-full w-full p-2">
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
      <!-- <iframe
        v-else-if="responsePreview"
        class="h-full w-full p-2"
        :srcdoc="responsePreview.body"
      /> -->
      <BodyViewer v-if="responsePreview" />
    </div>
  </div>
</template>
