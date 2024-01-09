<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useStore } from "../../store/store";

// ICONS
import CheckIcon from "../../assets/svg/checkmark.svg";
import FileIcon from "../../assets/svg/file.svg";
import FormIcon from "../../assets/svg/form.svg";
import NoneIcon from "../../assets/svg/none.svg";
import SelectIcon from "../../assets/svg/select.svg";
import TextIcon from "../../assets/svg/text.svg";

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
  <div class="flex w-full justify-between">
    <div class="flex items-center gap-3">
      <button
        class="relative z-10 flex w-fit items-center justify-between gap-2 rounded-lg fill-current px-2 py-1 text-sm shadow-md hover:bg-bg4"
        :class="[open ? 'bg-bg4' : 'bg-bg3']"
        v-on:click="open = !open"
      >
        <div v-if="body.type === 'None'" class="z-10 w-5" v-html="NoneIcon" />
        <div
          v-else-if="body.type === 'Text'"
          class="z-10 w-5"
          v-html="TextIcon"
        />
        <div
          v-else-if="body.type === 'Form'"
          class="z-10 w-[18px] fill-none stroke-current"
          v-html="FormIcon"
        />
        <div
          v-else-if="body.type === 'File'"
          class="z-10 w-4"
          v-html="FileIcon"
        />

        {{ body.type }}
        <div v-html="SelectIcon" class="size-3 fill-current" />

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
            <div
              v-html="CheckIcon"
              class="size-3 fill-primary"
              :class="option === body.type ? 'visible' : 'invisible'"
            />

            <div class="flex items-center justify-between gap-1 fill-current">
              <div class="size-5" v-html="NoneIcon" v-if="option === 'None'" />
              <div
                class="size-5"
                v-html="TextIcon"
                v-else-if="option === 'Text'"
              />
              <div
                class="size-[18px] fill-none stroke-current"
                v-html="FormIcon"
                v-else-if="option === 'Form'"
              />
              <div
                class="size-4"
                v-html="FileIcon"
                v-else-if="option === 'File'"
              />
              {{ option }}
            </div>
          </div>
        </div>
      </button>

      <!-- SubtypeButton -->
      <button
        v-on:click="openSubtype = !openSubtype"
        class="relative z-10 flex w-fit items-center justify-between gap-2 rounded-lg fill-current px-2 py-1 pl-3 text-sm shadow-md hover:bg-bg4"
        :class="[openSubtype ? 'bg-bg4' : 'bg-bg3']"
        v-if="body.type === 'Text'"
      >
        {{ body.subtype }}
        <div v-html="SelectIcon" class="size-3 fill-current" />

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
            <div
              v-html="CheckIcon"
              :class="option === body.subtype ? 'visible' : 'invisible'"
              class="size-3 fill-primary"
            />
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
      <!-- idk if i wanna keep this -->
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
