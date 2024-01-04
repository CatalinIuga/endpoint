<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useStore } from "../store/store";
import { coloredHttpMethod } from "../utils/coloring";
import UrlEditor from "./Highlighting/UrlEditor.vue";

// ICONS
import CheckmarkIcon from "../assets/svg/checkmark.svg";
import PlaneIcon from "../assets/svg/plane.svg";
import SelectIcon from "../assets/svg/select.svg";

const store = useStore();
const storeRef = storeToRefs(store);
const { method } = storeRef;

const methods = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
  "CONNECT",
  "TRACE",
] as const;

const open = ref(false);

const coloredHttpMethodClass = computed(() => {
  return (method: string) => coloredHttpMethod(method);
});
</script>

<template>
  <header
    class="flex w-full items-center justify-between gap-2 rounded-2xl bg-bg2 px-3 py-2 focus-within:bg-bg3 hover:bg-bg3"
  >
    <!-- METHOD SELECTOR -->
    <button
      class="relative flex items-center gap-1 rounded-lg py-1 pl-4 pr-3 hover:bg-bg4"
      :class="[
        coloredHttpMethodClass(method),
        open ? 'bg-bg4 text-primary' : '',
      ]"
      v-on:click="open = !open"
    >
      {{ method }}
      <!-- SELECTOR ICON -->
      <div v-html="SelectIcon" class="size-3 fill-current" />
      <!-- this is just a small triangle so it looks pretty :) -->
      <div v-if="open" class="absolute top-[34px] h-3 w-3 rotate-45 bg-bg4" />
      <!-- METHOD SELECTOR -->
      <div
        class="absolute -left-0 top-9 z-10 flex flex-col gap-1 rounded-xl bg-bg4 px-2 py-2 text-start shadow-sm shadow-black"
        v-if="open"
      >
        <div
          v-on:click="method = mtd"
          v-for="mtd in methods"
          class="flex items-center gap-2 rounded-md py-1 pl-2 pr-7 text-sm hover:bg-hovered"
          :class="[
            coloredHttpMethodClass(mtd),
            mtd === method ? 'bg-selected' : '',
          ]"
        >
          <!-- CHECKMARK ICON -->
          <div
            class="h-3 w-3 fill-primary"
            :class="mtd === method ? 'visible' : 'invisible'"
            v-html="CheckmarkIcon"
          />
          {{ mtd }}
        </div>
      </div>
    </button>

    <!-- URL INPUT -->
    <UrlEditor />

    <!-- SEND BUTTON -->
    <button
      class="flex rounded-md bg-green-400 px-4 py-1 text-sm text-secondary hover:bg-green-300"
      v-on:click="store.sendRequest()"
    >
      <span class="hidden sm:block">Send</span>
      <!-- PLANE ICON -->
      <div
        v-html="PlaneIcon"
        class="inline-block h-5 w-5 fill-current sm:hidden"
      />
    </button>
  </header>
</template>
