<script setup lang="ts">
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import { useStore } from "../../store/store";

import TrashIcon from "../../assets/svg/trash.svg";

const store = useStore();
const { headers } = storeToRefs(store);

const newInput = ref("");

const addNewHeader = async (target: "name" | "value") => {
  headers.value.push({
    checked: true,
    name: target === "name" ? newInput.value : "",
    value: target === "value" ? newInput.value : "",
  });

  // on next vue update set focus on the last input
  await nextTick();
  newInput.value = "";

  const input = document.getElementById(
    (headers.value.length - 1).toString() + target,
  ) as HTMLInputElement;
  input.focus();
};

const checkValidity = (index: number) => {
  // check if the header is empty
  if (
    headers.value[index].name.trim() === "" &&
    headers.value[index].value.trim() === ""
  ) {
    headers.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="flex flex-col gap-1 px-4 py-2">
    <!-- DEFINED PARAMETERS -->
    <div
      v-for="(header, index) in headers"
      :key="index"
      class="header-input group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg3"
    >
      <div class="flex items-center pl-1">
        <input
          type="checkbox"
          class="peer hidden"
          :id="'checkbox' + index"
          v-model="header.checked"
        />
        <label
          :for="'checkbox' + index"
          class="relative flex h-5 cursor-pointer select-none pl-8 before:absolute before:left-0 before:flex before:h-5 before:w-5 before:items-center before:justify-center before:rounded-md before:bg-bg4 before:hover:bg-bg6 peer-checked:before:bg-selected peer-checked:before:text-sm peer-checked:before:font-bold peer-checked:before:text-primary peer-checked:before:content-['✔'] peer-checked:before:hover:bg-[#4e4e4e]"
        >
        </label>
      </div>
      <input
        :id="index.toString() + 'name'"
        :class="header.checked ? ' text-blue-500' : 'opacity-75'"
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm caret-primary focus:outline-none focus:outline-blue-500"
        type="text"
        placeholder="name"
        @input="checkValidity(index)"
        v-model="header.name"
      />
      <input
        :id="index.toString() + 'value'"
        :class="header.checked ? ' text-primary' : 'opacity-75'"
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm caret-primary focus:outline-none focus:outline-blue-500"
        type="text"
        @input="checkValidity(index)"
        v-model="header.value"
        placeholder="value"
      />
      <button
        class="rounded-md p-1 hover:bg-bg4"
        @click="headers.splice(index, 1)"
      >
        <div
          class="invisible size-5 fill-none text-ternary group-hover:visible"
          v-html="TrashIcon"
          :class="header.checked ? 'visible' : 'invisible'"
        />
      </button>
      <div
        class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
      ></div>
    </div>
    <!-- STATIC PARAMETER INPUT -->
    <div
      class="group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg3"
    >
      <div class="flex items-center pl-1">
        <input
          type="checkbox"
          class="peer hidden"
          id="custom_static"
          checked="false"
          disabled
        />
        <label
          for="custom_static"
          class="relative flex h-5 select-none pl-8 before:absolute before:left-0 before:flex before:h-5 before:w-5 before:items-center before:justify-center before:rounded-md before:bg-transparent peer-checked:before:border-[1px] peer-checked:before:border-primary peer-checked:before:border-opacity-5 peer-checked:before:text-sm peer-checked:before:font-bold"
        >
        </label>
      </div>
      <input
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-orange-400 caret-primary opacity-75 focus:outline-none focus:outline-blue-500"
        type="text"
        v-model="newInput"
        placeholder="name"
        @input="addNewHeader('name')"
      />
      <input
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary opacity-75 focus:outline-none focus:outline-blue-500"
        type="text"
        v-model="newInput"
        @input="addNewHeader('value')"
        placeholder="value"
      />
      <button class="invisible rounded-md p-1 hover:bg-bg4">
        <!-- placeholder for svg -->
        <div class="size-5 p-1" />
      </button>
      <div
        class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
      ></div>
    </div>
  </div>
</template>
