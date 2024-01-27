<script setup lang="ts">
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import { useStore } from "../../store/store";
import TextEditor from "../Highlighting/TextEditor.vue";

import FileIcon from "../../assets/svg/file.svg";
import NoneIcon from "../../assets/svg/none.svg";
import TrashIcon from "../../assets/svg/trash.svg";

const store = useStore();
const { body } = storeToRefs(store);

const newFormInput = ref("");
const newFileInput = ref<File>();
const newFile = ref<HTMLInputElement>();

const addNewFormInput = async (target: "key" | "data" | "file") => {
  if (body.value.type !== "Form") return;
  if (!body.value.data) body.value.data = [];
  if (!newFileInput.value && target === "file") return;
  body.value.data.push({
    checked: true,
    key: target === "key" ? newFormInput.value : "",
    value: target === "data" ? newFormInput.value : undefined,
    file: target === "file" ? newFileInput.value : undefined,
  });

  await nextTick();
  newFormInput.value = "";

  newFileInput.value = undefined;

  const input = document.getElementById(
    (body.value.data.length - 1).toString() + target,
  ) as HTMLInputElement;
  input.focus();
};

const formatSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let l = 0,
    n = size;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return n.toFixed(n >= 10 || l < 1 ? 0 : 1) + " " + units[l];
};

const clickFileInput = (index: number) => {
  const input = document.getElementById(
    index.toString() + "file",
  ) as HTMLInputElement;
  input.click();
};
</script>

<template>
  <!-- No body -->
  <div
    v-if="body.type === 'None'"
    class="flex h-full flex-col items-center justify-center gap-1 text-center text-ternary"
  >
    <div class="w-16 rounded-full bg-bg4 fill-current" v-html="NoneIcon" />

    <p class="text-ex text-lg">No body</p>
  </div>

  <!-- Text body -->
  <TextEditor />

  <!-- Form body -->
  <div
    v-if="body.type === 'Form'"
    class="flex h-full flex-col overflow-y-auto px-4 py-3"
  >
    <!-- DEFINED FORM DATA -->
    <div
      v-for="(data, index) in body.data"
      :key="index"
      class="group relative flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-bg3"
    >
      <div class="flex items-center pl-1">
        <input
          type="checkbox"
          class="peer hidden"
          :id="'checkbox' + index"
          v-model="data.checked"
        />
        <label
          :for="'checkbox' + index"
          class="relative flex h-5 cursor-pointer select-none pl-8 before:absolute before:left-0 before:flex before:h-5 before:w-5 before:items-center before:justify-center before:rounded-md before:bg-bg4 before:hover:bg-bg6 peer-checked:before:bg-selected peer-checked:before:text-sm peer-checked:before:font-bold peer-checked:before:text-primary peer-checked:before:content-['✔'] peer-checked:before:hover:bg-[#4e4e4e]"
        >
        </label>
      </div>
      <input
        :id="index.toString() + 'key'"
        :class="data.checked ? 'text-fuchsia-400' : 'opacity-75'"
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm caret-primary focus:outline-none focus:outline-blue-500"
        type="text"
        placeholder="key"
        v-model="data.key"
      />
      <!-- ON CLICK OPEN MENU FOR CLEAR -->
      <div
        v-if="data.file !== undefined"
        :class="data.checked ? ' text-primary' : 'opacity-75'"
        class="group w-full flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border-none bg-bg4 px-6 py-1 text-sm text-primary"
      >
        <label
          :for="index.toString() + 'file'"
          class="relative flex items-center justify-between gap-2 hover:cursor-pointer"
        >
          <span
            class="min-w-1/2 overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {{ data.file.name }}
          </span>
          <span class="text-xs text-ternary">
            {{ formatSize(data.file.size) }}
          </span>
        </label>
        <input
          :id="index.toString() + 'file'"
          class="hidden"
          type="file"
          @change="data.file = ($event!.target as HTMLInputElement).files![0]"
          placeholder="file"
        />
      </div>

      <input
        v-else
        :id="index.toString() + 'data'"
        :class="data.checked ? ' text-primary' : 'opacity-75'"
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary focus:outline-none focus:outline-blue-500"
        type="text"
        v-model="data.value"
        placeholder="data"
      />
      <input
        :id="index.toString() + 'file'"
        @input="
          data.file = ($event!.target! as HTMLInputElement).files![0];
          data.value = undefined;
        "
        type="file"
        class="hidden"
      />
      <button
        v-if="data.file === undefined"
        @click="clickFileInput(index)"
        class="relative rounded-md fill-current p-1 hover:bg-bg4"
      >
        <div class="z-10 w-4 stroke-current" v-html="FileIcon" />
      </button>

      <button
        class="rounded-md p-1 hover:bg-bg4"
        @click="body.data.splice(index, 1)"
      >
        <div
          class="invisible h-5 w-5 fill-none text-ternary group-hover:visible"
          v-html="TrashIcon"
        />
      </button>
      <div
        class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
      />
    </div>

    <!-- STATIC FORM INPUT -->
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
        class="flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-fuchsia-400 caret-primary opacity-75 focus:outline-none focus:outline-blue-500"
        type="text"
        v-model="newFormInput"
        placeholder="key"
        @input="addNewFormInput('key')"
      />
      <input
        class="relative flex-1 overflow-hidden break-words rounded-sm border-none bg-transparent px-1 text-sm text-primary caret-primary opacity-75 focus:outline-none focus:outline-blue-500"
        type="text"
        v-model="newFormInput"
        @input="addNewFormInput('data')"
        placeholder="value"
      />
      <input
        ref="newFile"
        @input="
          newFileInput = ($event!.target! as HTMLInputElement).files![0];
          addNewFormInput('file');
        "
        type="file"
        class="hidden"
      />
      <button
        @click="newFile?.click()"
        class="relative rounded-md fill-current p-1 hover:bg-bg4"
      >
        <div class="z-10 w-4 stroke-current" v-html="FileIcon" />
      </button>
      <button class="invisible rounded-md p-1 hover:bg-bg4">
        <div class="size-5" />
      </button>
      <div
        class="absolute bottom-0 left-2 w-[calc(100%-1rem)] border-b-[1px] border-primary border-opacity-5 group-hover:border-bg3"
      ></div>
    </div>
  </div>

  <!-- File body -->
  <div
    v-if="body.type === 'File'"
    class="flex h-full flex-col items-center justify-center gap-1 fill-current text-center text-ternary"
  >
    <div class="rounded-full bg-bg5">
      <div
        class="stroke-3 w-16 bg-transparent fill-current p-4"
        v-html="FileIcon"
      />
    </div>
    <p v-if="!body.file" class="text-ex text-lg">Upload a file here</p>
    <input
      @input="body.file = ($event!.target! as HTMLInputElement).files![0]"
      class="hidden"
      type="file"
      ref="newFile"
    />
    <div
      v-if="body.file"
      class="mx-4 my-2 rounded-md bg-bg6 px-3 py-1 shadow-md"
    >
      <div class="flex w-full justify-between gap-2">
        <span v-if="body.file" class="text-primary">
          {{ body.file.name }}
        </span>
        <span v-if="body.file" class="whitespace-nowrap text-ternary">
          {{ formatSize(body.file.size) }}
        </span>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button
        @click="newFile?.click()"
        class="rounded-md bg-bg5 px-4 py-1 shadow-md hover:bg-bg4"
      >
        {{ body.file ? "Replace" : "Choose a file" }}
      </button>

      <button
        v-if="body.file"
        class="rounded-md bg-bg5 px-4 py-1 shadow-md hover:bg-bg4"
        @click="body.file = undefined"
      >
        Clear
      </button>
    </div>
  </div>
</template>
