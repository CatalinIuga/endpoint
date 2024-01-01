<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useStore } from "../store/store";
import { coloredHttpMethod } from "../utils/coloring";
import UrlEditor from "./Highlighting/UrlEditor.vue";

const store = useStore();
const storeRef = storeToRefs(store);
const { method } = storeRef;
// 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
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
      class="relative flex items-center gap-1 rounded-lg px-4 py-1 hover:bg-bg4"
      :class="[
        coloredHttpMethodClass(method),
        open ? 'bg-bg4 text-primary' : '',
      ]"
      v-on:click="open = !open"
    >
      {{ method }}
      <svg
        class="h-3 w-3 fill-current"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 562.392 562.391"
        xml:space="preserve"
      >
        <g>
          <g>
            <path
              d="M123.89,262.141h314.604c19.027,0,17.467-31.347,15.496-47.039c-0.605-4.841-3.636-11.971-6.438-15.967L303.965,16.533
			c-12.577-22.044-32.968-22.044-45.551,0L114.845,199.111c-2.803,3.996-5.832,11.126-6.438,15.967
			C106.43,230.776,104.863,262.141,123.89,262.141z"
            />
            <path
              d="M114.845,363.274l143.569,182.584c12.577,22.044,32.968,22.044,45.551,0l143.587-182.609
			c2.804-3.996,5.826-11.119,6.438-15.967c1.971-15.691,3.531-47.038-15.496-47.038H123.89c-19.027,0-17.46,31.365-15.483,47.062
			C109.019,352.147,112.042,359.277,114.845,363.274z"
            />
          </g>
        </g>
      </svg>
      <div v-if="open" class="absolute top-[34px] h-3 w-3 rotate-45 bg-bg4" />
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
          <svg
            class="h-3 w-3 fill-primary"
            :class="mtd === method ? 'visible' : 'invisible'"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 288.941 288.941"
            xml:space="preserve"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path
                  id="Check"
                  d="M285.377,46.368c-4.74-4.704-12.439-4.704-17.179,0L96.309,217.114L20.734,142.61 c-4.74-4.704-12.439-4.704-17.179,0s-4.74,12.319,0,17.011l84.2,82.997c4.692,4.644,12.499,4.644,17.191,0l180.43-179.239 C290.129,58.687,290.129,51.06,285.377,46.368C280.637,41.664,290.129,51.06,285.377,46.368z"
                ></path>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
                <g></g>
              </g>
            </g>
          </svg>
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
      <!-- Cool plane svg -->
      <svg
        class="inline-block h-5 w-5 fill-current sm:hidden"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 256 256"
        enable-background="new 0 0 256 256"
        xml:space="preserve"
      >
        <g>
          <g>
            <g>
              <path
                fill="#000000"
                d="M122.5,75.3C1.9,113.5,10.1,110.7,10.1,114.6c0,1,0.3,2.3,0.8,2.9C11.5,118.4,44,144.8,46,146c0.3,0.2,3.6-1.4,7.8-3.7C217.1,49.7,234,40.1,233,40.3C232.8,40.3,183.1,56,122.5,75.3z"
              />
              <path
                fill="#000000"
                d="M169.5,107.1l-76.4,59.5l-0.1,6.1l-0.1,6.1l19.5,18c10.9,10,20.2,18.2,21.2,18.6c1.5,0.6,1.8,0.5,3.5-0.2c1.7-0.8,7.2-9.2,55.5-84.1C222,85.3,246.1,47.8,246,47.8C245.9,47.7,211.5,74.4,169.5,107.1z"
              />
              <path
                fill="#000000"
                d="M121.9,115.5l-70.9,40.2l0.1,22.8l0.1,22.8l1.6,1.4c1.6,1.4,3.8,1.8,5.7,1.1c0.4-0.2,5.9-6.2,12.2-13.5l11.4-13.1v-6.8c0-5.1,0.2-7.2,0.7-8.3c0.5-1.1,16.6-13.9,55.5-44.1c48.6-37.8,55.1-42.9,54.6-42.9C192.9,75.3,160.9,93.4,121.9,115.5z"
              />
            </g>
          </g>
        </g>
      </svg>
    </button>
  </header>
</template>
