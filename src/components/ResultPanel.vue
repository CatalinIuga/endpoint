<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useStore } from "../store/store";
import { coloredHttpMethod, coloredHttpStatus } from "../utils/coloring";

import XIcon from "../assets/svg/x.svg";
import ReadonlyViewer from "./Highlighting/ReadonlyViewer.vue";

// ICONS
import LoadingIcon from "../assets/svg/loading.svg";
import TrashIcon from "../assets/svg/trash.svg";

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

const relativeTime = ref("now");

const getRelativeTime = (date: string) => {
  const now = new Date();
  const sentAt = new Date(date);
  const diff = now.getTime() - sentAt.getTime();
  if (diff < 1000) return "now";
  if (diff < 60 * 1000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}m ago`;
  if (diff < 24 * 60 * 60 * 1000)
    return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
  return `${Math.floor(diff / (24 * 60 * 60 * 1000))}d ago`;
};

setInterval(() => {
  if (!responsePreview.value) return;
  relativeTime.value = getRelativeTime(responsePreview.value.sentAt!);
}, 1000);

const preattySize = (
  size: number,

  decimals: boolean = false,
) => {
  const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i))
      .toFixed(decimals ? 2 : 0)
      .toString()
      .replace(/\.?0*$/, "") + ["B", "KB", "MB", "GB", "TB"][i]
  );
};

const preattyTime = (time: number, decimals: boolean = false) => {
  if (time < 1000) {
    return `${time
      .toFixed(decimals ? 2 : 0)
      .toString()
      .replace(/\.?0*$/, "")}ms`;
  }
  return `${(time / 1000)
    .toFixed(decimals ? 2 : 0)
    .toString()
    .replace(/\.?0*$/, "")}s`;
};

const dateOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Europe/Bucharest",
};

const formattedDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", dateOptions).format(new Date(date));
};

const openHeaderPreview = ref(false);
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
      class="group rounded-md px-2 text-xs transition-colors hover:bg-hovered"
    >
      <div
        v-html="TrashIcon"
        class="size-5 fill-none stroke-current group-hover:text-red-500"
      />
    </button>
  </div>

  <!-- Error Message -->
  <div v-if="requestError" class="flex h-full w-full items-center">
    <div class="flex flex-1 flex-col items-center justify-center text-red-500">
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
    <div
      v-if="selectedTab === 'Request' && requestPreview"
      class="h-full w-full p-2"
    >
      <!-- HEADERS VIEWER -->
      <div v-if="requestPreview" class="flex flex-col gap-1 px-1 pb-2">
        <div
          @click="openHeaderPreview = !openHeaderPreview"
          class="group relative flex items-center gap-2 rounded-md p-1 font-bold hover:bg-bg3"
        >
          <!-- METHOD, PATH, STATUS VIEWER -->
          <button
            class="size-5 rounded-md fill-current text-center text-xs text-ternary transition-colors hover:bg-bg4"
            :class="openHeaderPreview ? 'rotate-90' : ''"
          >
            {{ "▶" }}
          </button>
          <div
            class="font-extrabold"
            :class="[coloredHttpMethod(requestPreview.method)]"
          >
            {{ requestPreview.method }}
          </div>
          <div class="font-extrabold">
            {{ path() }}
          </div>
          <div class="text-ternary/30">HTTP/1.1</div>

          <div v-if="!openHeaderPreview" class="text-ternary">
            {{
              "(" +
              requestPreview.headers.filter((h) => h.checked).length +
              " headers)"
            }}
          </div>
          <div
            class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
          />
        </div>
        <div v-if="openHeaderPreview" class="flex flex-col px-2">
          <div
            v-for="val in requestPreview?.headers.filter((h) => h.checked)"
            class="flex gap-2 border-b-[1px] border-primary border-opacity-5 py-1 text-sm"
          >
            <div
              class="w-1/3 max-w-xs flex-shrink-0 flex-grow-0 overflow-hidden overflow-ellipsis font-bold capitalize text-blue-500"
            >
              {{ val.name }}
            </div>
            <span
              class="overflow-hidden break-all text-primary"
            >
              {{ val.value || "<no-value>" }}
            </span>
          </div>
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
        <div v-html="LoadingIcon" class="size-10 animate-spin text-primary" />
      </div>

      <!-- Headers result -->
      <div v-else-if="responsePreview" class="flex flex-col gap-1 px-1 pb-2">
        <div
          @click="openHeaderPreview = !openHeaderPreview"
          class="group relative flex items-center gap-2 rounded-md p-1 font-bold hover:bg-bg3"
        >
          <button
            class="size-5 rounded-md fill-current text-center text-xs text-ternary transition-colors hover:bg-bg4"
            :class="openHeaderPreview ? 'rotate-90' : ''"
          >
            {{ "▶" }}
          </button>
          <div class="text-ternary/30">HTTP/1.1</div>
          <div
            class="font-extrabold"
            :class="[coloredHttpStatus(responsePreview.status)]"
          >
            {{ responsePreview?.status }}
          </div>
          <div
            class="font-extrabold"
            :class="[coloredHttpStatus(responsePreview.status)]"
          >
            {{ responsePreview?.statusText }}
          </div>
          <div v-if="!openHeaderPreview" class="text-ternary">
            {{
              "(" + Object.keys(responsePreview.headers).length + " headers)"
            }}
          </div>
          <div
            class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
          />
        </div>

        <div v-if="openHeaderPreview" class="flex flex-col px-2">
          <div
            v-for="(val, key) in responsePreview?.headers"
            class="flex gap-2 border-b-[1px] border-primary border-opacity-5 py-1 text-sm"
          >
            <div
              class="w-1/3 max-w-xs flex-shrink-0 flex-grow-0 overflow-hidden overflow-ellipsis font-bold capitalize text-blue-500"
            >
              {{ key }}
            </div>
            <span class="overflow-hidden break-all text-primary">{{
              val
            }}</span>
          </div>
        </div>
      </div>

      <!-- HTML PREVIEW -->
      <iframe
        v-if="responsePreview && previewHtml"
        class="h-full w-full rounded-md"
        sandbox="allow-scripts allow-same-origin"
        :srcdoc="`<base href='${requestPreview?.url}'>` + responsePreview.body"
      />

      <!-- TEXT RESULT PREVIEW (any type) -->
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
      />
      <span
        class="absolute left-3 inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform"
        :class="{
          'translate-x-3': previewHtml,
          'bg-bg': previewHtml,
          'bg-primary': !previewHtml,
        }"
      />
      <span class="text-sm text-primary">Preview</span>
    </button>
    <!-- Response info -->
    <div class="flex items-center gap-2">
      <button
        v-if="responsePreview"
        class="group relative items-center rounded-md bg-bg3 px-2 py-1 text-xs tracking-tighter text-ternary shadow-md hover:bg-hovered"
      >
        {{ preattySize(responsePreview?.size!) }},
        {{ preattyTime(responsePreview?.executionTime!) }},
        {{ relativeTime }}

        <!-- Response details -->
        <div
          class="invisible absolute -left-14 bottom-8 flex w-56 flex-col gap-1 rounded-md bg-bg4 p-2 text-xs shadow-md group-hover:visible"
        >
          <div
            class="flex items-center justify-between border-b-[1px] border-primary border-opacity-5 pb-[5px]"
          >
            <div class="whitespace-pre">Response size:</div>
            <div class="text-primary">
              {{ preattySize(responsePreview.size!, true) }}
            </div>
          </div>
          <div class="flex items-center justify-between p-[1px]">
            <div class="whitespace-pre">Executed for:</div>
            <div class="text-primary">
              {{ preattyTime(responsePreview.executionTime!, true) }}
            </div>
          </div>
          <div
            class="flex items-center justify-between gap-2 border-t-[1px] border-primary border-opacity-5 pt-[5px]"
          >
            <div class="whitespace-pre">Sent at:</div>
            <div class="text-primary">
              {{ formattedDate(responsePreview.sentAt!) }}
            </div>
          </div>
        </div>
      </button>
      <button class="rounded-md pb-2 text-sm hover:bg-hovered">...</button>
    </div>
  </div>
</template>
