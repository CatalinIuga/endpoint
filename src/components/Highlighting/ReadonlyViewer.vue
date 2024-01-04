<script setup lang="ts">
import { Compartment } from "@codemirror/state";
import { EditorView } from "codemirror";
import { storeToRefs } from "pinia";
import { computed, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { useStore } from "../../store/store";
import { readonlyExtensions } from "./cmConfig";

const store = useStore();
const { responsePreview } = storeToRefs(store);

const baseCompartment = new Compartment();
const extensions = baseCompartment.of(readonlyExtensions);
// Initialize the editor view
const view = shallowRef<EditorView>();
const handleReady = (payload: any) => {
  view.value = payload.view;
  view.value?.dispatch({
    effects: [baseCompartment.reconfigure(readonlyExtensions)],
  });
};

const body = computed(() => {
  if (responsePreview.value) {
    return responsePreview.value.body;
  }
  return "";
});
</script>

<template>
  <Codemirror
    disabled
    v-model.value="body"
    style="height: 100%; width: 100%"
    @ready="handleReady"
    :extensions="[extensions]"
    placeholder="<No body>"
  />
</template>
