<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useStore } from "../../store/store";

// ICONS
import ClosedEyeIcon from "../../assets/svg/eye-closed.svg";
import OpenEyeIcon from "../../assets/svg/eye-open.svg";
import NoneIcon from "../../assets/svg/none.svg";
import PasswordIcon from "../../assets/svg/password.svg";
import TagIcon from "../../assets/svg/tag.svg";
import TokenIcon from "../../assets/svg/token.svg";
import UserIcon from "../../assets/svg/user.svg";

const store = useStore();
const { auth } = storeToRefs(store);

const showPassword = ref(false);
const showToken = ref(false);
const showApiKey = ref(false);
</script>

<template>
  <!-- No auth -->
  <div
    v-if="auth.type === 'None'"
    class="flex h-full flex-col items-center justify-center gap-1 text-center text-ternary"
  >
    <!-- NONE ICON -->
    <div v-html="NoneIcon" class="w-16 rounded-full bg-bg4 fill-current" />
    <p class="text-lg">No authentication</p>
  </div>

  <!-- Basic auth -->
  <div
    v-else-if="auth.type === 'Basic auth'"
    class="flex h-full flex-col p-4 text-ternary"
  >
    <!-- Username input -->
    <div class="border-b-[1px] border-primary border-opacity-5 p-1">
      <div
        class="flex items-center gap-2 rounded-sm fill-current px-2 py-1 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500"
      >
        <!-- USER ICON -->
        <div class="w-5" v-html="UserIcon" />
        <input
          type="text"
          class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary focus:outline-none"
          v-model="auth.username"
          placeholder="username"
        />
      </div>
    </div>

    <!-- Password input -->
    <div class="border-b-[1px] border-primary border-opacity-5 px-2 py-1">
      <div
        class="flex items-center gap-2 rounded-sm fill-current px-2 py-1 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500"
      >
        <div class="w-5" v-html="PasswordIcon" />
        <input
          :type="showPassword ? 'text' : 'password'"
          class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary focus:outline-none"
          v-model="auth.password"
          placeholder="password"
        />
        <!-- SHOW PASSWORD ICON -->
        <div
          v-if="showPassword"
          v-html="OpenEyeIcon"
          class="w-4 cursor-pointer stroke-current"
          @click="showPassword = !showPassword"
        />
        <!-- UNSHOW PASSWORD -->
        <div
          v-else
          v-html="ClosedEyeIcon"
          class="w-4 cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </div>
    </div>
  </div>

  <!-- Bearer auth -->
  <div
    v-else-if="auth.type === 'Bearer token'"
    class="flex h-full flex-col p-4 text-ternary"
  >
    <div class="border-b-[1px] border-primary border-opacity-5 p-1">
      <div
        class="flex items-center gap-2 rounded-sm fill-current px-2 py-1 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500"
      >
        <!-- TOKEN ICON -->
        <div class="w-5" v-html="TokenIcon" />
        <input
          :type="showToken ? 'text' : 'password'"
          class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary focus:outline-none"
          v-model="auth.token"
          placeholder="token"
        />
        <!-- SHOW TOKEN ICON -->
        <div
          v-if="showToken"
          v-html="OpenEyeIcon"
          class="w-4 cursor-pointer stroke-current"
          @click="showToken = !showToken"
        />
        <!-- UNSHOW TOKEN -->
        <div
          v-else
          v-html="ClosedEyeIcon"
          class="w-4 cursor-pointer"
          @click="showToken = !showToken"
        />
      </div>
    </div>
  </div>

  <!-- API key -->
  <div
    v-else-if="auth.type === 'API key'"
    class="flex h-full flex-col p-4 text-ternary"
  >
    <!-- Header input -->
    <div class="border-b-[1px] border-primary border-opacity-5 p-1">
      <div
        class="flex items-center gap-2 rounded-sm fill-current px-2 py-1 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500"
      >
        <div class="w-5" v-html="TagIcon" />
        <input
          type="text"
          class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary focus:outline-none"
          v-model="auth.header"
          placeholder="header"
        />
      </div>
    </div>

    <!-- Api key input -->
    <div class="border-b-[1px] border-primary border-opacity-5 p-1">
      <div
        class="flex items-center gap-2 rounded-sm fill-current px-2 py-1 outline-offset-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500"
      >
        <div class="w-5" v-html="TokenIcon" />
        <input
          :type="showApiKey ? 'text' : 'password'"
          class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary focus:outline-none"
          v-model="auth.value"
          placeholder="value"
        />
        <!-- SHOW API KEY ICON -->
        <div
          v-if="showApiKey"
          v-html="OpenEyeIcon"
          class="w-4 cursor-pointer stroke-current"
          @click="showApiKey = !showApiKey"
        />
        <!-- UNSHOW API KEY -->
        <div
          v-else
          v-html="ClosedEyeIcon"
          class="w-4 cursor-pointer"
          @click="showApiKey = !showApiKey"
        />
      </div>
    </div>
  </div>
</template>
