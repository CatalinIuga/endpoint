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
        />
        <span
          class="absolute left-3 inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform"
          :class="{
            'translate-x-3': body.multipart,
            'bg-bg': body.multipart,
            'bg-primary': !body.multipart,
          }"
        />
        <span class="text-sm text-primary">Multipart</span>
      </button>
    </div>
  </div>
</template>
