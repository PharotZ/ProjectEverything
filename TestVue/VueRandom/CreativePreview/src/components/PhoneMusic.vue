<script setup>
import { motion, useMotionValue, useTransform } from "motion-v"
import { allAlbums } from "@/assets/albumData/albums.js"
import { defineEmits, onMounted, onUnmounted } from "vue"
import { albumColors } from "@/assets/albumData/colors.js" // <-- Import color mapping

const emit = defineEmits(['select-album'])
const x = useMotionValue(0)
const y = useMotionValue(0)

const offsets = [
  { x: 0, y: 0 },
  { x: 60, y: 60 },
  { x: 60, y: -60 },
  { x: -60, y: 60 },
  { x: -60, y: -60 },
  { x: 120, y: 0 },
  { x: -120, y: 0 },
  { x: 0, y: 120 },
  { x: 0, y: -120 },
  { x: 120, y: 120 },
  { x: -120, y: -120 },
  { x: 120, y: -120 },
  { x: -120, y: 120 },
  { x: 180, y: 180 },
  { x: -180, y: 180 },
  { x: -180, y: -180 },
  { x: 180, y: -180 },
  { x: 180, y: 60 },
  { x: -180, y: 60 },
  { x: 180, y: -60 },
  { x: -180, y: -60 },
  { x: 60, y: 180 },
  { x: -60, y: 180 },
  { x: 60, y: -180 },
  { x: -60, y: -180 },
  { x: 240, y: 0 },
  { x: -240, y: 0 },
  { x: 0, y: 240 },
  { x: 0, y: -240 },
  { x: 240, y: 240 },
  { x: -240, y: -240 },
  { x: 240, y: -240 },
  { x: -240, y: 240 },
]

// Each circle gets a scale transform based on its offset from center
const circles = allAlbums.map((album, i) => {
  const offset = offsets[i % offsets.length]
  const scale = useTransform([x, y], ([xVal, yVal]) => {
    const dx = xVal + offset.x
    const dy = yVal + offset.y - 10
    const dist = Math.sqrt(dx * dx + dy * dy)
    return 1 - Math.min(1, dist / 150)
  })
  // Get album color or fallback
  const color = albumColors[album.name] || { primary: "#fff", accent: "#222", secondary: "#000" }
  return { offset, scale, album, color }
})

const dragConstraints = {
  left: -200,
  right: 200,
  top: -200,
  bottom: 200
};

function handleCircleClick(album) {
  emit('select-album', album)
}

function disableScroll() {
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100vw'
  document.body.style.height = '100vh'
}

function enableScroll() {
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
}

onMounted(() => {
  // Only apply on small screens (phones)
  if (window.innerWidth < 600) {
    disableScroll()
  }
})

onUnmounted(() => {
  enableScroll()
})
</script>

<template>
  <div class="center-page">
    <div class="drag-container">
      <motion.div
        v-for="(circle, i) in circles"
        :key="i"
        class="circle"
        drag
        :dragConstraints="dragConstraints"
        :motion="{ x, y, scale: circle.scale }"
        :style="{
          position: 'absolute',
          left: `calc(50% + ${circle.offset.x}px - 45px)`,
          top: `calc(50% + ${circle.offset.y}px - 45px)`,
          x,
          y,
          scale: circle.scale,
          width: '90px',
          height: '90px',
          backgroundImage: `url(${circle.album.coverUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          border: `3px dotted ${circle.color.primary}`,
          boxShadow: `0 4px 24px 0 ${circle.color.accent}99, 0 0 0 4px ${circle.color.secondary}33`,
          transition: 'box-shadow 0.2s, border 0.2s'
        }"
        @click="handleCircleClick(circle.album)"
      />
    </div>
  </div>
</template>

<style>
body {
  min-height: 100vh;
  margin: 0;
  background: #000000;
}

.center-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: absolute;
  margin-top: 70px;
}

.drag-container {
  position: absolute;
  width: 325px;
  height: 325px;
  border-radius: 50%;
  border: 2px dotted var(--primary-color);
}

.circle {
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s;
}
.circle:active {
  filter: brightness(0.95);
  box-shadow: 0 4px 32px #0008, 0 0 0 6px #fff2;
}
</style>
