<script setup lang="ts">
import { ref } from "vue";
import Auth from "./RequestTabs/Auth.vue";
import AuthMenu from "./RequestTabs/AuthMenu.vue";

import Body from "./RequestTabs/Body.vue";
import BodyMenu from "./RequestTabs/BodyMenu.vue";

import HeadersTab from "./RequestTabs/HeadersTab.vue";
import ParamsTab from "./RequestTabs/ParamsTab.vue";

const tabs = ["Params", "Headers", "Auth", "Body"];
const selectedTab = ref("Params");
</script>

<template>
  <!-- Tabs -->
  <div class="flex border-b-[1px] border-primary border-opacity-5 px-2 py-2">
    <div class="flex gap-[2px] text-xs text-ternary">
      <button
        v-for="tab in tabs"
        class="relative flex items-center rounded-lg px-4 py-2 hover:bg-hovered"
        :class="
          selectedTab === tab
            ? 'bg-selected text-primary hover:bg-selected'
            : ''
        "
        @click="selectedTab = tab"
      >
        {{ tab }}
      </button>
    </div>
  </div>

  <!-- Tab content -->
  <div
    :class="
      ['Params', 'Headers'].includes(selectedTab)
        ? 'overflow-y-auto'
        : selectedTab === 'Body'
          ? 'overflow-auto'
          : ''
    "
    class="h-full w-full overflow-hidden"
  >
    <ParamsTab v-if="selectedTab === 'Params'" />
    <HeadersTab v-else-if="selectedTab === 'Headers'" />
    <Auth v-else-if="selectedTab === 'Auth'" />
    <Body v-else-if="selectedTab === 'Body'" />
  </div>

  <!-- Tab submenus -->
  <div
    v-if="['Auth', 'Body'].includes(selectedTab)"
    class="h-15 flex border-t-[1px] border-primary border-opacity-5 p-3"
  >
    <AuthMenu v-if="selectedTab === 'Auth'" />
    <BodyMenu v-else-if="selectedTab === 'Body'" />
  </div>
</template>
