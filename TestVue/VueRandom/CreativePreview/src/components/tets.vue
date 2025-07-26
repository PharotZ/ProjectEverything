<script setup>
import { motion, useMotionValue, useTransform } from "motion-v"

const x = useMotionValue(0)
const y = useMotionValue(0)

// Get viewport center
function getCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

let scale = useTransform([x, y], ([xVal, yVal]) => {
  const dx = xVal
  const dy = yVal
  const dist = Math.sqrt(dx * dx + dy * dy)
  console.log("scale:", 1.5 - Math.min(1.5, dist / 200))
  return 1.5 - Math.min(1.5, dist / 200)
})


</script>

<template>
  <div class="center-page">
    <motion.div
      class="circle"
      drag
      :style="{
        width: '90px',
        height: '90px',
        x,
        y,
        scale,
        backgroundColor: '#ff0088',
        borderRadius: '50%',
        boxShadow: '0 4px 32px #0004'
      }"
    />
  </div>
</template>

<style>
body {
  min-height: 100vh;
  margin: 0;
  background: #181c1f;
}

/* Center the outer container in the middle of the page */
/* Center the page content */
.center-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
