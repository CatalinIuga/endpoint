<script setup lang="ts">
import { onMounted, ref } from "vue";
import RequestPanel from "./RequestPanel.vue";
import ResultPanel from "./ResultPanel.vue";

const requestPanel = ref<HTMLElement | null>(null);
const resultPanel = ref<HTMLElement | null>(null);

const requestPanelWidth = ref(0);

onMounted(() => {
  localStorage.getItem("requestPanelWidth") &&
    (requestPanelWidth.value = Number(
      localStorage.getItem("requestPanelWidth"),
    ));
});

const dragSlider = (e: MouseEvent) => {
  let dragX = e.clientX;
  let block = requestPanel.value;
  let block2 = resultPanel.value;

  document.onmousemove = function onMouseMove(e: MouseEvent) {
    // set mouse cursor to col-resize
    document.body.style.cursor = "col-resize";

    if (!block || !block2) return;

    // if mouse goes too far right, the slider will wait for it to come back before moving left
    if (e.clientX > block.offsetLeft && e.clientX > block2.offsetLeft)
      dragX = block.offsetLeft + block.offsetWidth;
    // same for the left side
    else if (
      e.clientX < block.offsetLeft + block.offsetWidth &&
      e.clientX < block2.offsetLeft
    )
      dragX = block2.offsetLeft;

    let newWidth = block.offsetWidth + e.clientX - dragX;
    block.style.width = newWidth + "px";
    dragX = e.clientX;

    localStorage.setItem("requestPanelWidth", String(newWidth));
  };

  // reset cursor and remove event listeners
  document.onmouseup = () => {
    document.body.style.cursor = "default";
    document.onmousemove = null;
    document.onmouseup = null;
  };
};
</script>

<template>
  <section class="flex h-full w-full overflow-hidden rounded-t-2xl bg-bg2">
    <article
      ref="requestPanel"
      class="flex min-w-[25%] flex-col overflow-auto"
      :style="{ width: requestPanelWidth + 'px' }"
    >
      <RequestPanel />
    </article>

    <!-- Resizable handle -->
    <div
      @mousedown="dragSlider"
      class="w-2 cursor-col-resize select-none text-primary opacity-5 transition-all duration-200 hover:text-green-400 hover:opacity-100"
    >
      <div id="middle" class="h-full w-[1px] bg-current"></div>
    </div>

    <article ref="resultPanel" class="flex min-w-[25%] flex-1 flex-col">
      <ResultPanel />
    </article>
  </section>
</template>
