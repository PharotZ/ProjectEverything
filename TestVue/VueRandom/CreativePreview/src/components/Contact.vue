<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import { instagramIcon, githubIcon, linkedinIcon } from '@/assets/icons'

const openIndex = ref(-1)

function toggleOpen(idx: number) {
  openIndex.value = openIndex.value === idx ? -1 : idx
}
</script>

<template>
  <div class="container">
    <motion.div
      :layout="true"
      :data-open="openIndex === 0"
      :initial="{ borderRadius: '50px' }"
      class="parent"
      @click="toggleOpen(0)"
    >
      <motion.div
        :data-open="openIndex === 0"
        :layout="true"
        class="child"
        v-html="githubIcon"
      />
    </motion.div>

    <motion.div
      :layout="true"
      :data-open="openIndex === 1"
      :initial="{ borderRadius: '50px' }"
      class="parent"
      @click="toggleOpen(1)"
    >
      <motion.div
        :data-open="openIndex === 1"
        :layout="true"
        class="child"
        v-html="instagramIcon"
      />
    </motion.div>

    <motion.div
      :layout="true"
      :data-open="openIndex === 2"
      :initial="{ borderRadius: '50px' }"
      class="parent"
      @click="toggleOpen(2)"
    >
      <motion.div
        :data-open="openIndex === 2"
        :layout="true"
        class="child"
        v-html="linkedinIcon"
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
  margin: 0 12px;
}

.parent[data-open="true"] {
  width: 400px;
  height: 200px;
  padding: 10px;
  align-items: flex-start;
  justify-content: flex-start;
}

.child {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
