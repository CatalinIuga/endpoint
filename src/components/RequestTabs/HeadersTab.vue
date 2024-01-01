<script setup lang="ts">
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import { useStore } from "../../store/store";

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
    (headers.value.length - 1).toString() + target
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
      class="header-input flex relative gap-2 rounded-lg px-2 py-2 w-full group hover:bg-bg3 items-center"
    >
      <div class="flex items-center pl-1">
        <input
          type="checkbox"
          class="hidden peer"
          :id="'checkbox' + index"
          v-model="header.checked"
        />
        <label
          :for="'checkbox' + index"
          class="relative flex h-5 before:hover:bg-bg6 cursor-pointer pl-8 select-none before:absolute before:left-0 before:flex before:h-5 before:w-5 before:items-center before:justify-center before:rounded-md before:bg-bg4 peer-checked:before:bg-selected peer-checked:before:hover:bg-[#4e4e4e] peer-checked:before:content-['✔'] peer-checked:before:font-bold peer-checked:before:text-primary peer-checked:before:text-sm"
        >
        </label>
      </div>
      <input
        :id="index.toString() + 'name'"
        :class="header.checked ? ' text-blue-500' : 'opacity-75'"
        class="bg-transparent flex-1 border-none text-sm caret-primary focus:outline-none focus:outline-blue-500 break-words overflow-hidden rounded-sm px-1"
        type="text"
        placeholder="name"
        @input="checkValidity(index)"
        v-model="header.name"
      />
      <input
        :id="index.toString() + 'value'"
        :class="header.checked ? ' text-primary' : 'opacity-75'"
        class="bg-transparent flex-1 border-none text-sm caret-primary focus:outline-none focus:outline-blue-500 break-words overflow-hidden rounded-sm px-1"
        type="text"
        @input="checkValidity(index)"
        v-model="header.value"
        placeholder="value"
      />
      <button
        class="p-1 rounded-md hover:bg-bg4"
        @click="headers.splice(index, 1)"
      >
        <svg
          viewBox="0 0 24 24"
          class="invisible group-hover:visible text-ternary fill-none w-5 h-5"
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
              d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
              class="stroke-ternary"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      <div
        class="absolute group-hover:border-bg3 border-primary bottom-0 left-2 border-b-[1px] border-opacity-5 w-[calc(100%-1rem)]"
      ></div>
    </div>
    <!-- STATIC PARAMETER INPUT -->
    <div
      class="flex relative gap-2 rounded-lg px-2 py-2 w-full group hover:bg-bg3 items-center"
    >
      <div class="flex items-center pl-1">
        <input
          type="checkbox"
          class="hidden peer"
          id="custom_static"
          checked="false"
          disabled
        />
        <label
          for="custom_static"
          class="relative flex h-5 pl-8 select-none before:absolute before:left-0 before:flex before:h-5 before:w-5 before:items-center before:justify-center before:rounded-md before:bg-transparent peer-checked:before:border-primary peer-checked:before:border-[1px] peer-checked:before:border-opacity-5 peer-checked:before:font-bold peer-checked:before:text-sm"
        >
        </label>
      </div>
      <input
        class="bg-transparent opacity-75 text-orange-400 flex-1 border-none text-sm caret-primary focus:outline-none focus:outline-blue-500 break-words overflow-hidden rounded-sm px-1"
        type="text"
        v-model="newInput"
        placeholder="name"
        @input="addNewHeader('name')"
      />
      <input
        class="bg-transparent opacity-75 text-primary flex-1 border-none text-sm caret-primary focus:outline-none focus:outline-blue-500 break-words overflow-hidden rounded-sm px-1"
        type="text"
        v-model="newInput"
        @input="addNewHeader('value')"
        placeholder="value"
      />
      <button class="p-1 invisible rounded-md hover:bg-bg4">
        <svg
          viewBox="0 0 24 24"
          class="invisible text-ternary fill-none w-5 h-5"
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
              d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
              class="stroke-ternary"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      <div
        class="absolute group-hover:border-bg3 border-primary bottom-0 left-2 border-b-[1px] border-opacity-5 w-[calc(100%-1rem)]"
      ></div>
    </div>
  </div>
</template>
