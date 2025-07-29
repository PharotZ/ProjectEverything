<script setup>
import { computed } from 'vue'
import { motion, useMotionValue, useTransform } from 'motion-v'

const { card, isFront, index } = defineProps({
  card: { type: Object, required: true },
  isFront: { type: Boolean, required: true },
  index: { type: Number, required: false, default: 0 }
})
const emit = defineEmits(['swipe'])

const x = useMotionValue(0)
const rotateRaw = useTransform(x, [-150, 150], [-18, 18])
const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0])

const stackZ = computed(() => (isFront ? 3 : 3 - Math.min(index, 2)))
const rotate = useTransform(() => `${rotateRaw.get()}deg`)

function handleDragEnd() {
  if (Math.abs(x.get()) > 100 && isFront) {
    emit('swipe', card.id)
    x.set(0) // facultatif, pour éviter un "snap" visuel
  } else {
    x.set(0) // remet la carte en place si pas assez swipée
  }
}
</script>

<template>
  <motion.img
    :src="card.url"
    alt="Visuel"
    draggable="false"
    class="card-img"
    :class="{ front: isFront }"
    :style="{
      x,
      opacity,
      rotate,
      zIndex: stackZ,
      transition: '0.125s transform',
      boxShadow: isFront
        ? '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)'
        : undefined,
    }"
    :animate="{ scale: isFront ? 1 : 0.98 }"
    :drag="isFront ? 'x' : false"
    :drag-constraints="{ left: 0, right: 0 }"
    @dragend="handleDragEnd"
  />
</template>

<style scoped>
.card-img {
  height: 400px;
  width: 280px;
  object-fit: cover;
  border-radius: 16px;
  background: #23263a;
  user-select: none;
  position: absolute;
  will-change: transform;
  box-shadow: 0 4px 24px #0006;
}
.front {
  z-index: 2;
}
.card-stack-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  width: 100%;
}

.card-stack {
  display: grid;
  place-items: center;
  height: 420px;
  width: 320px;
  position: relative;
}
</style>
