<script setup lang="ts">
import ResizablePanel from "./components/ResizablePanel.vue";
import Topbar from "./components/Topbar.vue";
import Main from "./layouts/Main.vue";
</script>

<template>
  <Main>
    <Topbar />
    <ResizablePanel />
  </Main>
</template>
