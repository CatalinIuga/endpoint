<script setup lang="ts">
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import { useStore } from "../../store/store";
import TextEditor from "../Highlighting/TextEditor.vue";

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
    <svg
      class="w-16 rounded-full bg-bg4 fill-current"
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
          v-on:change="
            data.file = ($event!.target as HTMLInputElement).files![0]
          "
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
        v-on:input="
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
        <svg
          class="z-10 w-4 stroke-current"
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
      </button>

      <button
        class="rounded-md p-1 hover:bg-bg4"
        @click="body.data.splice(index, 1)"
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
        v-on:input="
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
        <svg
          class="z-10 w-4 stroke-current"
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
      </button>
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

  <!-- File body -->
  <div
    v-if="body.type === 'File'"
    class="flex h-full flex-col items-center justify-center gap-1 fill-current text-center text-ternary"
  >
    <div class="rounded-full bg-bg5">
      <svg
        class="stroke-3 w-16 bg-transparent fill-current p-4"
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
          <g id="Page-1" stroke="none" fill-rule="evenodd" sketch:type="MSPage">
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
    </div>
    <p v-if="!body.file" class="text-ex text-lg">Upload a file here</p>
    <input
      v-on:input="
        body.file = ($event!.target! as HTMLInputElement).files![0]
        // body.file.arrayBuffer().then((buffer) => {
        //   console.log(buffer);
        // }); // -> might actually work
      "
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
