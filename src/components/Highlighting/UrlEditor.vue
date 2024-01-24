<script setup lang="ts">
import { storeToRefs } from "pinia";
import Prism from "prismjs";
import "prismjs/components/prism-uri";
import { onMounted, ref } from "vue";
import { useStore } from "../../store/store";

const store = useStore();
const { url } = storeToRefs(store);

const urlEditor = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (urlEditor.value) {
    urlEditor.value.innerHTML = Prism.highlight(
      url.value,
      Prism.languages.uri,
      "uri",
    );
  }
});

/**
 * Parse the pasted text and update the url, highlingting inlcuded
 * @param e Input event
 */
const updateUrl = (e: Event) => {
  const target = e.target as HTMLDivElement;

  const restore = saveCaretPosition(target);

  url.value = target.textContent!;
  target.innerHTML = Prism.highlight(url.value, Prism.languages.uri, "uri");

  restore();
};

/**
 * On paste, parse the pasted text and update the url, highlingting inlcuded
 * @param e Input event
 */
const urlPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  const text = e.clipboardData!.getData("text/plain");

  url.value = text;
  // this is for sure initialized right?
  urlEditor.value!.innerHTML = Prism.highlight(
    url.value,
    Prism.languages.uri,
    "uri",
  );
};

/**
 * On Enter key press, send the request
 * @param e Keyboard event
 */
const checkSend = (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    store.sendRequest();
  }
};

/**
 * God bless this guy
 * https://stackoverflow.com/a/38479462
 */
function saveCaretPosition(context: Node) {
  var selection = window.getSelection()!;
  var range = selection.getRangeAt(0);
  range.setStart(context, 0);
  var len = range.toString().length;

  return function restore() {
    var pos = getTextNodeAtPosition(context, len);
    selection.removeAllRanges();
    var range = new Range();
    range.setStart(pos.node, pos.position);
    selection.addRange(range);
  };
}

function getTextNodeAtPosition(root: Node, index: number) {
  const NODE_TYPE = NodeFilter.SHOW_TEXT;
  var treeWalker = document.createTreeWalker(
    root,
    NODE_TYPE,
    function next(elem) {
      if (index > elem.textContent!.length) {
        index -= elem.textContent!.length;
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  );
  var c = treeWalker.nextNode();
  return {
    node: c ? c : root,
    position: index,
  };
}
</script>

<template>
  <div
    ref="urlEditor"
    contenteditable
    @keydown="checkSend"
    @paste="urlPaste"
    class="flex-1 cursor-text overflow-hidden break-words rounded-lg px-2 py-1 font-bold text-blue-400 caret-primary focus:outline-none"
    @input="updateUrl"
  ></div>
</template>
