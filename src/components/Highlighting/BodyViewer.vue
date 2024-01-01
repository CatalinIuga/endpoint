<script setup lang="ts">
import { Compartment } from "@codemirror/state";
import { EditorView } from "codemirror";
import { storeToRefs } from "pinia";
import { shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { useStore } from "../../store/store";
import { readonlyExtensions } from "./config";

const store = useStore();
const { responseBody } = storeToRefs(store);

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
</script>

<template>
  <!-- TODO ADD NEW STYLES FOR THIS 🫠 -->
  <Codemirror
    disabled
    v-model.value="responseBody"
    style="height: 100%; width: 100%; padding: 4px 4px"
    :autofocus="true"
    :tab-size="2"
    @ready="handleReady"
    :extensions="[extensions]"
    placeholder="<No body>"
  />
</template>
