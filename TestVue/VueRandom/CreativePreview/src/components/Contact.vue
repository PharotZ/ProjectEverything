<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'

const isOpen = ref(false)

function toggleOpen() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="container">
    <motion.div
      :layout="true"
      :data-open="isOpen"
      :initial="{ borderRadius: '50px' }"
      class="parent"
      @click="toggleOpen"
    >
      <motion.div
        :data-open="isOpen"
        :layout="true"
        class="child"
      />
    </motion.div>
  </div>
</template>

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
}

.parent {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: #f5f5f5;
}

.parent[data-open="true"] {
  width: 400px;
  height: 200px;
}

.child {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f107a3;
}
</style>
