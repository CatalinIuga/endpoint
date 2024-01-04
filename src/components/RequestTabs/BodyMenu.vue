<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useStore } from "../../store/store";

const options = ["None", "Text", "Form", "File"] as const;
const textOptionSubtypes = ["Raw", "JSON", "XML"] as const;

const store = useStore();

const { body } = storeToRefs(store);

watch(
  () => body.value.type,
  (type) => {
    if (type === "Text") {
      // @ts-ignore
      body.value.subtype = body.value.subtype || "Raw";
    }
  },
);

const open = ref(false);
const openSubtype = ref(false);
</script>

<template>
  <div class="flex justify-between w-full">
    <div class="flex items-center gap-3">
      <button
        class="relative z-10 flex w-fit items-center justify-between gap-2 rounded-lg fill-current px-2 py-1 text-sm shadow-md hover:bg-bg4"
        :class="[open ? 'bg-bg4' : 'bg-bg3']"
        v-on:click="open = !open"
      >
        <svg
          v-if="body.type === 'None'"
          class="z-10 w-[20px]"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          transform="matrix(1, 0, 0, 1, 0, 0)"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M8.46457 14.1213C8.07404 14.5118 8.07404 15.145 8.46457 15.5355C8.85509 15.926 9.48825 15.926 9.87878 15.5355L15.5356 9.87862C15.9262 9.4881 15.9262 8.85493 15.5356 8.46441C15.1451 8.07388 14.5119 8.07388 14.1214 8.46441L8.46457 14.1213Z"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.34315 17.6569C9.46734 20.781 14.5327 20.781 17.6569 17.6569C20.781 14.5327 20.781 9.46734 17.6569 6.34315C14.5327 3.21895 9.46734 3.21895 6.34315 6.34315C3.21895 9.46734 3.21895 14.5327 6.34315 17.6569ZM16.2426 16.2426C13.8995 18.5858 10.1005 18.5858 7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736C10.1005 5.41421 13.8995 5.41421 16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426Z"
            ></path>
          </g>
        </svg>
        <svg
          class="z-10 w-4"
          v-else-if="body.type === 'Text'"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm2 2.25a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 4 5.25Zm4.5 0a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm-4.5 3a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 4 8.25Zm4.5 0a.75.75 0 0 1 .75-.75H11A.75.75 0 0 1 11 9H9.25a.75.75 0 0 1-.75-.75Zm-4.5 3a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Zm4.5 0a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75ZM3 12.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
            fill="currentColor"
          ></path>
        </svg>
        <svg
          v-else-if="body.type === 'Form'"
          class="z-10 w-4 fill-none stroke-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M3 9.5H21M3 14.5H21M8 4.5V19.5M6.2 19.5H17.8C18.9201 19.5 19.4802 19.5 19.908 19.282C20.2843 19.0903 20.5903 18.7843 20.782 18.408C21 17.9802 21 17.4201 21 16.3V7.7C21 6.5799 21 6.01984 20.782 5.59202C20.5903 5.21569 20.2843 4.90973 19.908 4.71799C19.4802 4.5 18.9201 4.5 17.8 4.5H6.2C5.0799 4.5 4.51984 4.5 4.09202 4.71799C3.71569 4.90973 3.40973 5.21569 3.21799 5.59202C3 6.01984 3 6.57989 3 7.7V16.3C3 17.4201 3 17.9802 3.21799 18.408C3.40973 18.7843 3.71569 19.0903 4.09202 19.282C4.51984 19.5 5.07989 19.5 6.2 19.5Z"
              stroke-width="2"
            ></path>
          </g>
        </svg>
        <svg
          v-else-if="body.type === 'File'"
          class="z-10 w-[14px] stroke-current"
          viewBox="0 0 28 28"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill-rule="evenodd"
              sketch:type="MSPage"
            >
              <g
                id="Icon-Set"
                sketch:type="MSLayerGroup"
                transform="translate(-258.000000, -154.000000)"
              >
                <path
                  d="M284.562,164.181 L270.325,178.26 C267.966,180.593 264.141,180.593 261.782,178.26 C259.423,175.928 259.423,172.146 261.782,169.813 L274.596,157.141 C276.168,155.586 278.718,155.586 280.291,157.141 C281.863,158.696 281.863,161.218 280.291,162.772 L267.477,175.444 C266.691,176.222 265.416,176.222 264.629,175.444 C263.843,174.667 263.843,173.406 264.629,172.628 L276.02,161.365 L274.596,159.957 L263.206,171.221 C261.633,172.775 261.633,175.297 263.206,176.853 C264.778,178.407 267.328,178.407 268.901,176.852 L281.714,164.181 C284.073,161.849 284.074,158.065 281.715,155.733 C279.355,153.4 275.531,153.4 273.172,155.733 L259.646,169.108 L259.696,169.157 C257.238,172.281 257.455,176.797 260.358,179.668 C263.262,182.539 267.828,182.754 270.987,180.323 L271.036,180.372 L285.986,165.589 L284.562,164.181"
                  id="attachment-2"
                  sketch:type="MSShapeGroup"
                ></path>
              </g>
            </g>
          </g>
        </svg>

        {{ body.type }}
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

        <div
          v-if="open"
          class="absolute bottom-[20px] z-0 h-3 w-3 rotate-45 bg-bg4"
        />
        <div
          class="absolute -left-0 bottom-9 z-10 flex flex-col gap-1 rounded-xl bg-bg4 px-2 py-2 text-start shadow-sm shadow-black"
          v-if="open"
        >
          <div
            v-on:click="body.type = option"
            v-for="option in options"
            class="flex items-center gap-2 whitespace-nowrap rounded-md py-1 pl-2 pr-4 text-sm hover:bg-hovered"
            :class="[option === body.type ? 'bg-selected' : '']"
          >
            <svg
              class="h-3 w-3 fill-primary"
              :class="option === body.type ? 'visible' : 'invisible'"
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
            <div class="flex items-center justify-between gap-1 fill-current">
              <svg
                v-if="option === 'None'"
                class="w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                transform="matrix(1, 0, 0, 1, 0, 0)"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M8.46457 14.1213C8.07404 14.5118 8.07404 15.145 8.46457 15.5355C8.85509 15.926 9.48825 15.926 9.87878 15.5355L15.5356 9.87862C15.9262 9.4881 15.9262 8.85493 15.5356 8.46441C15.1451 8.07388 14.5119 8.07388 14.1214 8.46441L8.46457 14.1213Z"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.34315 17.6569C9.46734 20.781 14.5327 20.781 17.6569 17.6569C20.781 14.5327 20.781 9.46734 17.6569 6.34315C14.5327 3.21895 9.46734 3.21895 6.34315 6.34315C3.21895 9.46734 3.21895 14.5327 6.34315 17.6569ZM16.2426 16.2426C13.8995 18.5858 10.1005 18.5858 7.75736 16.2426C5.41421 13.8995 5.41421 10.1005 7.75736 7.75736C10.1005 5.41421 13.8995 5.41421 16.2426 7.75736C18.5858 10.1005 18.5858 13.8995 16.2426 16.2426Z"
                  ></path>
                </g>
              </svg>
              <svg
                class="w-4"
                v-else-if="option === 'Text'"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm2 2.25a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 4 5.25Zm4.5 0a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm-4.5 3a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2A.75.75 0 0 1 4 8.25Zm4.5 0a.75.75 0 0 1 .75-.75H11A.75.75 0 0 1 11 9H9.25a.75.75 0 0 1-.75-.75Zm-4.5 3a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Zm4.5 0a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75ZM3 12.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
                  fill="currentColor"
                ></path>
              </svg>
              <svg
                v-else-if="option === 'Form'"
                class="w-4 fill-none stroke-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M3 9.5H21M3 14.5H21M8 4.5V19.5M6.2 19.5H17.8C18.9201 19.5 19.4802 19.5 19.908 19.282C20.2843 19.0903 20.5903 18.7843 20.782 18.408C21 17.9802 21 17.4201 21 16.3V7.7C21 6.5799 21 6.01984 20.782 5.59202C20.5903 5.21569 20.2843 4.90973 19.908 4.71799C19.4802 4.5 18.9201 4.5 17.8 4.5H6.2C5.0799 4.5 4.51984 4.5 4.09202 4.71799C3.71569 4.90973 3.40973 5.21569 3.21799 5.59202C3 6.01984 3 6.57989 3 7.7V16.3C3 17.4201 3 17.9802 3.21799 18.408C3.40973 18.7843 3.71569 19.0903 4.09202 19.282C4.51984 19.5 5.07989 19.5 6.2 19.5Z"
                    stroke-width="2"
                  ></path>
                </g>
              </svg>
              <svg
                v-else-if="option === 'File'"
                class="w-[14px] stroke-current"
                viewBox="0 0 28 28"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <g
                    id="Page-1"
                    stroke="none"
                    stroke-width="1"
                    fill-rule="evenodd"
                    sketch:type="MSPage"
                  >
                    <g
                      id="Icon-Set"
                      sketch:type="MSLayerGroup"
                      transform="translate(-258.000000, -154.000000)"
                    >
                      <path
                        d="M284.562,164.181 L270.325,178.26 C267.966,180.593 264.141,180.593 261.782,178.26 C259.423,175.928 259.423,172.146 261.782,169.813 L274.596,157.141 C276.168,155.586 278.718,155.586 280.291,157.141 C281.863,158.696 281.863,161.218 280.291,162.772 L267.477,175.444 C266.691,176.222 265.416,176.222 264.629,175.444 C263.843,174.667 263.843,173.406 264.629,172.628 L276.02,161.365 L274.596,159.957 L263.206,171.221 C261.633,172.775 261.633,175.297 263.206,176.853 C264.778,178.407 267.328,178.407 268.901,176.852 L281.714,164.181 C284.073,161.849 284.074,158.065 281.715,155.733 C279.355,153.4 275.531,153.4 273.172,155.733 L259.646,169.108 L259.696,169.157 C257.238,172.281 257.455,176.797 260.358,179.668 C263.262,182.539 267.828,182.754 270.987,180.323 L271.036,180.372 L285.986,165.589 L284.562,164.181"
                        id="attachment-2"
                        sketch:type="MSShapeGroup"
                      ></path>
                    </g>
                  </g>
                </g>
              </svg>
              {{ option }}
            </div>
          </div>
        </div>
      </button>

      <!-- SubtypeButton -->
      <button
        v-on:click="openSubtype = !openSubtype"
        class="relative z-10 flex w-fit items-center justify-between gap-2 rounded-lg fill-current px-2 py-1 text-sm shadow-md hover:bg-bg4"
        :class="[openSubtype ? 'bg-bg4' : 'bg-bg3']"
        v-if="body.type === 'Text'"
      >
        {{ body.subtype }}
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

        <div
          v-if="openSubtype"
          class="absolute bottom-[20px] z-0 h-3 w-3 rotate-45 bg-bg4"
        />
        <div
          class="absolute -left-0 bottom-9 z-10 flex flex-col gap-1 rounded-xl bg-bg4 px-2 py-2 text-start shadow-sm shadow-black"
          v-if="openSubtype"
        >
          <div
            v-on:click="body.subtype = option"
            v-for="option in textOptionSubtypes"
            class="flex items-center gap-2 whitespace-nowrap rounded-md py-1 pl-2 pr-4 text-sm hover:bg-hovered"
            :class="[option === body.subtype ? 'bg-selected' : '']"
          >
            <svg
              class="h-3 w-3 fill-primary"
              :class="option === body.subtype ? 'visible' : 'invisible'"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
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
            {{ option }}
          </div>
        </div>
      </button>

      <!-- Multipart form toggle -->
      <button
        v-on:click="body.multipart = !body.multipart"
        class="relative flex items-center justify-between gap-2 rounded-lg fill-current px-2 py-1 text-sm"
        v-if="body.type === 'Form'"
      >
        <span
          class="left-0 inline-block h-5 w-9 rounded-3xl shadow-sm transition-transform"
          :class="[body.multipart ? 'bg-green-400' : 'bg-bg4']"
        ></span>
        <span
          class="absolute left-3 inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform"
          :class="{
            'translate-x-3': body.multipart,
            'bg-bg': body.multipart,
            'bg-primary': !body.multipart,
          }"
        ></span>
        <span class="text-sm text-primary">Multipart</span>
      </button>
    </div>

    <!-- FORMAT BUTTON! -->
    <!-- TODO add the prittier formater to this aswell... -->
    <button
      class="flex items-center justify-center rounded-lg bg-bg3 fill-current px-2 py-1 text-sm shadow-md hover:bg-bg4"
      v-if="body.type === 'Text' && body.subtype === 'JSON'"
      @click="body.text = JSON.stringify(JSON.parse(body.text), null, 2) || ''"
    >
      <svg
        class="h-5 w-5 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M14.1809 4.2755C14.581 4.3827 14.8185 4.79396 14.7113 5.19406L10.7377 20.0238C10.6304 20.4239 10.2192 20.6613 9.81909 20.5541C9.41899 20.4469 9.18156 20.0356 9.28876 19.6355L13.2624 4.80583C13.3696 4.40573 13.7808 4.16829 14.1809 4.2755Z"
          ></path>
          <path
            d="M16.4425 7.32781C16.7196 7.01993 17.1938 6.99497 17.5017 7.27206L19.2392 8.8358C19.9756 9.49847 20.5864 10.0482 21.0058 10.5467C21.4468 11.071 21.7603 11.6342 21.7603 12.3295C21.7603 13.0248 21.4468 13.5881 21.0058 14.1123C20.5864 14.6109 19.9756 15.1606 19.2392 15.8233L17.5017 17.387C17.1938 17.6641 16.7196 17.6391 16.4425 17.3313C16.1654 17.0234 16.1904 16.5492 16.4983 16.2721L18.1947 14.7452C18.9826 14.0362 19.5138 13.5558 19.8579 13.1467C20.1882 12.7541 20.2603 12.525 20.2603 12.3295C20.2603 12.1341 20.1882 11.9049 19.8579 11.5123C19.5138 11.1033 18.9826 10.6229 18.1947 9.91383L16.4983 8.387C16.1904 8.10991 16.1654 7.63569 16.4425 7.32781Z"
          ></path>
          <path
            d="M7.50178 8.387C7.80966 8.10991 7.83462 7.63569 7.55752 7.32781C7.28043 7.01993 6.80621 6.99497 6.49833 7.27206L4.76084 8.8358C4.0245 9.49847 3.41369 10.0482 2.99428 10.5467C2.55325 11.071 2.23975 11.6342 2.23975 12.3295C2.23975 13.0248 2.55325 13.5881 2.99428 14.1123C3.41369 14.6109 4.02449 15.1606 4.76082 15.8232L6.49833 17.387C6.80621 17.6641 7.28043 17.6391 7.55752 17.3313C7.83462 17.0234 7.80966 16.5492 7.50178 16.2721L5.80531 14.7452C5.01743 14.0362 4.48623 13.5558 4.14213 13.1467C3.81188 12.7541 3.73975 12.525 3.73975 12.3295C3.73975 12.1341 3.81188 11.9049 4.14213 11.5123C4.48623 11.1033 5.01743 10.6229 5.80531 9.91383L7.50178 8.387Z"
          ></path>
        </g>
      </svg>
    </button>
  </div>
</template>
