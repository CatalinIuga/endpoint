<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useStore } from "../../store/store";

// ICONS
import CheckIcon from "../../assets/svg/checkmark.svg";
import NoneIcon from "../../assets/svg/none.svg";
import SelectIcon from "../../assets/svg/select.svg";
import TagIcon from "../../assets/svg/tag.svg";
import TokenIcon from "../../assets/svg/token.svg";
import UserIcon from "../../assets/svg/user.svg";

const options = ["None", "Basic auth", "Bearer token", "API key"] as const;
const store = useStore();

const { auth } = storeToRefs(store);
const open = ref(false);
</script>

<template>
  <button
    class="relative z-10 flex w-fit items-center justify-between gap-2 rounded-lg fill-current px-2 py-1 text-sm shadow-md hover:bg-bg4"
    :class="[open ? 'bg-bg4' : 'bg-bg3']"
    v-on:click="open = !open"
  >
    <div v-if="auth.type === 'None'" v-html="NoneIcon" class="z-10 w-5" />
    <div
      class="z-10 w-5"
      v-else-if="auth.type === 'Basic auth'"
      v-html="UserIcon"
    />
    <div
      class="z-10 w-5"
      v-else-if="auth.type === 'Bearer token'"
      v-html="TokenIcon"
    />
    <div
      class="z-10 w-5"
      v-else-if="auth.type === 'API key'"
      v-html="TagIcon"
    />
    {{ auth.type }}

    <!-- SELEC ICON -->
    <div v-html="SelectIcon" class="h-3 w-3 fill-current" />

    <div
      v-if="open"
      class="absolute bottom-[20px] z-0 h-3 w-3 rotate-45 bg-bg4"
    />
    <div
      class="absolute -left-0 bottom-9 z-10 flex flex-col gap-1 rounded-xl bg-bg4 px-2 py-2 text-start shadow-sm shadow-black"
      v-if="open"
    >
      <div
        v-on:click="auth.type = option"
        v-for="option in options"
        class="flex items-center gap-2 whitespace-nowrap rounded-md py-1 pl-2 pr-4 text-sm hover:bg-hovered"
        :class="[option === auth.type ? 'bg-selected' : '']"
      >
        <!-- CHECK ICON -->
        <div
          v-html="CheckIcon"
          class="h-3 w-3 fill-primary"
          :class="option === auth.type ? 'visible' : 'invisible'"
        />

        <div class="flex items-center gap-1 fill-current">
          <div v-if="option === 'None'" class="w-5" v-html="NoneIcon" />
          <div
            v-else-if="option === 'Basic auth'"
            class="w-4"
            v-html="UserIcon"
          />
          <div
            v-else-if="option === 'Bearer token'"
            class="w-4"
            v-html="TokenIcon"
          />
          <div v-else-if="option === 'API key'" class="w-4" v-html="TagIcon" />
          {{ option }}
        </div>
      </div>
    </div>
  </button>
</template>
