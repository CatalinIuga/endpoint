<script setup lang="ts">
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";
import { linter } from "@codemirror/lint";
import { Compartment } from "@codemirror/state";
import { EditorView } from "codemirror";
import { storeToRefs } from "pinia";
import { ShallowRef, shallowRef, watch, watchEffect } from "vue";
import { Codemirror } from "vue-codemirror";
import { useStore } from "../../store/store";
import { baseExtensions } from "./cmConfig";

const store = useStore();
const { body } = storeToRefs(store);

const baseCompartment = new Compartment();
const extensions = baseCompartment.of(baseExtensions);

// Initialize the editor view
const view = shallowRef<EditorView>();
const handleReady = (payload: any) => {
  view.value = payload.view;
};

// Reconfigure the editor extensions based on the body content type
const refreshExtensions = (view: ShallowRef<EditorView | undefined>) => {
  if (!view.value) return;

  if (body.value.type !== "Text") return;
  
  switch (body.value.subtype) {
    case "JSON":
      view.value.dispatch({
        effects: baseCompartment.reconfigure([
          ...baseExtensions,
          json(),
          linter(jsonParseLinter()),
        ]),
      });
      break;

    case "XML":
      view.value.dispatch({
        effects: baseCompartment.reconfigure([...baseExtensions, xml()]),
      });
      break;

    default:
      view.value.dispatch({
        effects: baseCompartment.reconfigure(baseExtensions),
      });
      break;
  }
};

// TODO: fuck if i know why i have this one?
watchEffect(() => {
  if (!view.value) return;
  refreshExtensions(view);
});

// Watch for changes in the body content type then reconfigure the editor
watch(body.value, () => {
  if (!view.value) return;
  refreshExtensions(view);
});
</script>

<template>
  <Codemirror
    v-if="body.type === 'Text'"
    v-model.value="body.text"
    style="height: 100%; width: 100%; padding: 4px 4px"
    :autofocus="true"
    :tab-size="2"
    @ready="handleReady"
    :extensions="[extensions]"
    placeholder="Enter text here"
  />
</template>
