<script setup lang="ts">
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import { useStore } from "../../store/store";

const store = useStore();
const { parameters } = storeToRefs(store);

const newInput = ref("");

const addNewParameter = async (target: "key" | "value") => {
  parameters.value.push({
    checked: true,
    key: target === "key" ? newInput.value : "",
    value: target === "value" ? newInput.value : "",
  });

  // on next vue update set focus on the last input
  await nextTick();
  newInput.value = "";

  const input = document.getElementById(
    (parameters.value.length - 1).toString() + target,
  ) as HTMLInputElement;
  input.focus();
};

const checkValidity = (index: number) => {
  if (
    parameters.value[index].key.trim() === "" &&
    parameters.value[index].value.trim() === ""
  ) {
    parameters.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="flex flex-col gap-1 px-4 py-2">
    <!-- DEFINED PARAMETERS -->
    <div
      v-for="(parameter, index) in parameters"
      :key="index"
      class="group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg3"
    >
      <div class="flex items-center pl-1">
        <input
          type="checkbox"
          class="peer hidden"
          :id="'checkbox' + index"
          v-model="parameter.checked"
        />
        <label
          :for="'checkbox' + index"
          class="relative flex h-5 cursor-pointer select-none pl-8 before:absolute before:left-0 before:flex before:h-5 before:w-5 before:items-center before:justify-center before:rounded-md before:bg-bg4 before:hover:bg-bg6 peer-checked:before:bg-selected peer-checked:before:text-sm peer-checked:before:font-bold peer-checked:before:text-primary peer-checked:before:content-['✔'] peer-checked:before:hover:bg-[#4e4e4e]"
        >
        </label>
      </div>
      <input
        :id="index.toString() + 'key'"
        :class="parameter.checked ? ' text-orange-400' : 'opacity-75'"
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm caret-primary focus:outline-none focus:outline-blue-500"
        type="text"
        placeholder="key"
        @input="checkValidity(index)"
        v-model="parameter.key"
      />
      <input
        :id="index.toString() + 'value'"
        :class="parameter.checked ? ' text-primary' : 'opacity-75'"
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm caret-primary focus:outline-none focus:outline-blue-500"
        type="text"
        @input="checkValidity(index)"
        v-model="parameter.value"
        placeholder="value"
      />
      <button
        class="rounded-md p-1 hover:bg-bg4"
        @click="parameters.splice(index, 1)"
      >
        <svg
          viewBox="0 0 24 24"
          class="invisible h-5 w-5 fill-none text-ternary group-hover:visible"
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
        placeholder="key"
        @input="addNewParameter('key')"
      />
      <input
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary opacity-75 focus:outline-none focus:outline-blue-500"
        type="text"
        v-model="newInput"
        @input="addNewParameter('value')"
        placeholder="value"
      />
      <button class="invisible rounded-md p-1 hover:bg-bg4">
        <svg
          viewBox="0 0 24 24"
          class="invisible h-5 w-5 fill-none text-ternary"
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
        class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
      ></div>
    </div>
  </div>
</template>
