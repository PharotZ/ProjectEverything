<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { allAlbums, albumColors } from '@/assets/albumData'
import { hatch } from 'ldrs'
import PhoneMusic from './PhoneMusic.vue'
hatch.register()

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const wheelRadius = 400
const albumCount = allAlbums.length
const angleStep = 360 / albumCount
const rotation = ref(0) // Current wheel rotation in degrees
const selectedIndex = ref(0)
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.5)

const isPhone = ref(window.innerWidth < 600)
const isTabletLandscape = ref(window.innerWidth >= 600 && window.innerWidth <= 1024 && window.innerHeight < window.innerWidth)

const handleResize = () => {
    isPhone.value = window.innerWidth < 600
    isTabletLandscape.value = window.innerWidth >= 600 && window.innerWidth <= 1024 && window.innerHeight < window.innerWidth
}

const selectAlbumFromWheel = (albumIndex) => {
    if (isTabletLandscape.value) {
        // L'album doit être à 270° (centre droit)
        // Angle de base de l'album (sans rotation)
        const baseAngle = albumIndex * angleStep
        
        // Pour que cet album soit à 270°, on calcule la rotation nécessaire
        // rotation + baseAngle = 270° (modulo 360°)
        let targetRotation = (270 - baseAngle) % 360
        
        // Normaliser l'angle pour éviter les sauts brusques
        if (targetRotation < 0) targetRotation += 360
        
        // Trouver le chemin le plus court vers la cible
        const currentRotation = rotation.value % 360
        let diff = targetRotation - currentRotation
        
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        
        rotation.value = currentRotation + diff
        selectedIndex.value = albumIndex
        updateSelectedIndex()
    }
}
// Position albums around the wheel
const albumPositions = computed(() => {
    return allAlbums.map((album, i) => {
        // Angle for this album
        const angle = (i * angleStep + rotation.value) % 360
        // Convert angle to radians
        const rad = (angle - 90) * Math.PI / 180 // -90 so 0° is at top
        // Position on wheel
        const x = wheelRadius * Math.cos(rad)
        const y = wheelRadius * Math.sin(rad)
        return {
            ...album,
            angle,
            x,
            y,
            index: i,
            centered: i === selectedIndex.value
        }
    })
})

const currentColors = computed(() => {
    const albumName = selectedAlbum.value?.name
    return albumColors[albumName] || { primary: "#42b883", secondary: "#369970", accent: "#2c7a5c" }
})

// CSS custom properties for dynamic colors
const dynamicStyles = computed(() => {
    const colors = currentColors.value
    return {
        '--primary-color': colors.primary,
        '--secondary-color': colors.secondary,
        '--accent-color': colors.accent,
        '--primary-glow': colors.primary + '40', // Add transparency for glow effects
        '--secondary-glow': colors.secondary + '40'
    }
})

// Find the centered album (closest to 270°)
const updateSelectedIndex = () => {
    let minDiff = 9999
    let idx = 0
    albumPositions.value.forEach((pos, i) => {
        // 270° is right center
        let diff = Math.abs(((pos.angle + 360) % 360) - 270)
        if (diff > 180) diff = 360 - diff
        if (diff < minDiff) {
            minDiff = diff
            idx = i
        }
    })
    selectedIndex.value = idx
}

// Scroll event: rotate wheel
const handleScroll = (event) => {
    const delta = event.deltaY
    rotation.value += delta * 0.10 // Adjust sensitivity as needed
    rotation.value = (rotation.value + 360) % 360
    updateSelectedIndex()
    event.preventDefault()
}

// Music player logic
const selectedAlbumPhone = ref(allAlbums[0])

function selectAlbum(album) {
  if (isPhone.value) {
    selectedAlbumPhone.value = album
  } else {
    // Find index and update wheel selection
    const idx = allAlbums.findIndex(a => a.name === album.name)
    if (idx !== -1) {
      if (isTabletLandscape.value) {
        selectAlbumFromWheel(idx)
      } else {
        selectedIndex.value = idx
      }
    }
  }
}

// Utiliser selectedAlbum pour desktop/tablette, selectedAlbumPhone pour téléphone
const selectedAlbum = computed(() =>
  isPhone.value ? selectedAlbumPhone.value : allAlbums[selectedIndex.value]
)

watch(selectedAlbum, (album) => {
    if (audioRef.value && album) {
        audioRef.value.src = album.audioUrl
        audioRef.value.load()
        currentTime.value = 0
        if (isPlaying.value) playAudio()
    }
})

const playAudio = () => {
    if (audioRef.value) {
        audioRef.value.play()
        isPlaying.value = true
    }
}
const pauseAudio = () => {
    if (audioRef.value) {
        audioRef.value.pause()
        isPlaying.value = false
    }
}
const togglePlayPause = () => {
    isPlaying.value ? pauseAudio() : playAudio()
}
const updateTime = () => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime
        duration.value = audioRef.value.duration || 0
    }
}
const seekTo = (event) => {
    if (audioRef.value && duration.value) {
        const rect = event.currentTarget.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const newTime = percent * duration.value;
        audioRef.value.currentTime = newTime;
        // Remove direct assignment to currentTime, let timeupdate event handle it
    }
}
const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
const setVolumeSlider = (event) => {
    const val = parseFloat(event.target.value)
    // Use a quadratic curve for more natural volume scaling
    const curved = Math.pow(val, 2)
    volume.value = val
    if (audioRef.value) {
        audioRef.value.volume = curved
    }
}
const handleImageError = (event) => {
    event.target.src = '/covers/default-cover.jpg'
}

const dragging = ref(false)
const lastX = ref(0)
const lastRotation = ref(0)
const wheelRef = ref(null)
const dragSide = ref(1) // 1 for right, -1 for left

function onWheelMouseDown(e) {
    dragging.value = true
    lastX.value = e.clientY
    lastRotation.value = rotation.value

    // Detect left or right of wheel center
    const rect = wheelRef.value.getBoundingClientRect()
    dragSide.value = (e.clientX < rect.left + rect.width / 2) ? -1 : 1

    window.addEventListener('mousemove', onWheelMouseMove)
    window.addEventListener('mouseup', onWheelMouseUp)
}

function onWheelMouseMove(e) {
    if (!dragging.value) return
    const deltaY = e.clientY - lastX.value
    rotation.value = (lastRotation.value + deltaY * 0.3 * dragSide.value) % 360
    updateSelectedIndex()
}
function onWheelMouseUp() {
    dragging.value = false
    window.removeEventListener('mousemove', onWheelMouseMove)
    window.removeEventListener('mouseup', onWheelMouseUp)
}
// Touch support
function onWheelTouchStart(e) {
    if (e.touches.length !== 1) return
    dragging.value = true
    lastX.value = e.touches[0].clientY
    lastRotation.value = rotation.value

    const rect = wheelRef.value.getBoundingClientRect()
    dragSide.value = (e.touches[0].clientX < rect.left + rect.width / 2) ? -1 : 1

    window.addEventListener('touchmove', onWheelTouchMove)
    window.addEventListener('touchend', onWheelTouchEnd)
}

function onWheelTouchMove(e) {
    if (!dragging.value || e.touches.length !== 1) return
    const deltaY = e.touches[0].clientY - lastX.value
    rotation.value = (lastRotation.value + deltaY * 0.3 * dragSide.value) % 360
    updateSelectedIndex()
}

function onWheelTouchEnd() {
    dragging.value = false
    window.removeEventListener('touchmove', onWheelTouchMove)
    window.removeEventListener('touchend', onWheelTouchEnd)
}

onMounted(() => {
    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('resize', handleResize)
    if (audioRef.value) {
        audioRef.value.addEventListener('timeupdate', updateTime)
        audioRef.value.addEventListener('ended', () => {
            isPlaying.value = false
            currentTime.value = 0
        })
        audioRef.value.volume = volume.value
    }
    updateSelectedIndex()

     if (isIOS) {
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        document.body.style.height = '100%'
        document.documentElement.style.overflow = 'hidden'
        
        // Prévenir le scroll tactile
        document.addEventListener('touchmove', preventScroll, { passive: false })
    } else {
        document.body.style.overflow = 'hidden'
    }
})
onUnmounted(() => {
    window.removeEventListener('wheel', handleScroll)
    window.removeEventListener('resize', handleResize)
    if (audioRef.value) {
        audioRef.value.removeEventListener('timeupdate', updateTime)
    }
    if (isIOS) {
        document.body.style.overflow = 'auto'
        document.body.style.position = 'static'
        document.body.style.width = 'auto'
        document.body.style.height = 'auto'
        document.documentElement.style.overflow = 'auto'
        
        document.removeEventListener('touchmove', preventScroll)
    } else {
        document.body.style.overflow = 'auto'
    }
})
const preventScroll = (e) => {
    e.preventDefault()
}
</script>

<template>
    <div class="WheelScrolling" :style="dynamicStyles">
        <!-- Hidden audio element -->
        <audio ref="audioRef" preload="metadata"></audio>
        
        <PhoneMusic v-if="isPhone" :selectedAlbum="selectedAlbumPhone" @select-album="selectAlbum" />
        
        <!-- Main wheel container - affiché aussi sur tablette landscape -->
        <div v-else ref="wheelRef" class="wheel"
            @mousedown="onWheelMouseDown"
            @touchstart="onWheelTouchStart"
            style="touch-action: pan-y;">
            <!-- Individual album items positioned around the wheel -->
            <div v-for="(album) in albumPositions" 
                :key="`album-${album.index}`" 
                class="wheel-item"
                :class="{ 'selected': album.centered }" 
                :style="{
                    transform: `translate(-50%, -50%) translate(${album.x}px, ${album.y}px)`
                }"
                @click="isTabletLandscape ? selectAlbumFromWheel(album.index) : null">
                <div class="album-content">
                    <div class="album-card">
                        <h3>{{ album.name }}</h3>
                    </div>
                </div>
            </div>
        </div>

        <!-- Music Player -->
        <div class="music-player">
            <div class="player-header">
                <div class="album-cover">
                    <img v-if="selectedAlbum" :src="selectedAlbum.coverUrl" :alt="selectedAlbum.name"
                        @error="handleImageError" />
                </div>
                <div class="player-info">
                    <h3 v-if="selectedAlbum">{{ selectedAlbum.name }}</h3>
                </div>
            </div>

            <div class="player-controls">
                <button @click="togglePlayPause" class="play-pause-btn">
                    <span v-if="isPlaying">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </span>
                    <span v-else><svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                            viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="M8 18V6l8 6-8 6Z" />
                        </svg>
                    </span>
                </button>
            </div>

            <div class="player-progress">
                <span class="time">{{ formatTime(currentTime) }}</span>
                <div class="progress-bar" @click="seekTo">
                    <div class="progress-track">
                        <div class="progress-fill"
                            :style="{ width: duration ? (currentTime / duration) * 100 + '%' : '0%' }"></div>
                    </div>
                </div>
                <span class="time">{{ formatTime(duration) }}</span>
            </div>

            <div v-if="!isIOS" class="volume-control">
                <span>🔊</span>
                <input type="range" min="0" max="1" step="0.01" v-model="volume" @input="setVolumeSlider"
                    class="volume-slider" />
            </div>
        </div>
    </div>
</template>

<style scoped>

body, html {
    overflow: hidden !important;
    position: fixed !important;
    width: 100% !important;
    height: 100% !important;
}
.album-card,
.album-card * {
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.WheelScrolling {
    height: 98vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
    position: relative;
    overflow: hidden;
    transition: all 0.6s ease;
}

.wheel {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* Increased offset to ensure items can fully hide   */
    width: 2400px;
    /* Increased width to match new offset */
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
}

.wheel-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center;
    cursor: pointer;
    z-index: 1;
    pointer-events: all;
    transition: transform 0.2s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.wheel-item.active-scrolling {
    transition: transform 0.05s linear;
}

.album-content {
    transform-origin: center;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1000px;
    will-change: transform;
    width: 100%;
    height: 100%;
}

.album-card {   
    border-radius: 6px;
    padding: 8px 12px;
    border: 2px dotted var(--primary-color);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 0 10px var(--primary-glow);
    display: inline-block;
    width: 300px;
    box-sizing: border-box;
    overflow-x: hidden;
}

.album-content.hovered .album-card {
    border-color: var(--secondary-color);
    box-shadow: 0 0 20px var(--secondary-glow);
    background-color: rgba(10, 10, 10, 0.8);
    z-index: 1;
}

.wheel-item.selected .album-card {
    border-color: var(--accent-color);
    box-shadow: 0 0 30px var(--primary-color);
    background-color: rgba(var(--primary-color), 0.1);
}

.wheel-item h3 {
    font-family: var(--font-headings);
    font-size: 1.2rem;
    margin: 0;
    white-space: nowrap;
    text-align: center;
}

.music-player {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.9);
    border: 2px dotted var(--primary-color);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 300px;
    z-index: 10;
    transition: border-color 0.6s ease;
}

.player-header {
    display: flex;
    align-items: center;
    gap: 15px;
}

.album-cover {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px dotted var(--primary-color);
    transition: border-color 0.6s ease;
    flex-shrink: 0; /* Prevent shrinking */
}

.album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.cover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.album-cover:hover .cover-overlay {
    opacity: 1;
}

.play-icon {
    font-size: 1.5rem;
    color: var(--primary-color);
}

.player-info {
    flex: 1;
}

.player-info h3 {
    color: var(--primary-color);
    margin: 0;
    font-size: 1.1rem;
    transition: color 0.6s ease;
    line-height: 1.3;
    word-break: break-word; /* Allow wrapping */
}

.player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
}

.play-pause-btn {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.play-pause-btn span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
}

.play-pause-btn:hover span {
    height: 24px;
    width: 24px;
}

.play-pause-btn svg {
    transition: transform 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
}

.play-pause-btn:hover svg {
    transform: scale(1.15);
}

.play-pause-btn:hover {
    box-shadow: 0 0 20px var(--primary-glow);
}

.player-progress {
    display: flex;
    align-items: center;
    gap: 10px;
}

.time {
    color: var(--primary-color);
    font-size: 0.9rem;
    min-width: 40px;
    transition: color 0.6s ease;
}

.progress-bar,
.volume-bar {
    flex: 1;
    cursor: pointer;
}

.progress-track,
.volume-track {
    height: 6px;
    background-color: var(--primary-glow);
    border-radius: 3px;
    position: relative;
    overflow: hidden;
}

.progress-fill,
.volume-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 3px;
    transition: width 0.1s ease, background 0.6s ease;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
}

.volume-control span {
    font-size: 1.1rem;
}

.volume-bar {
    width: 100px;
}

input[type="range"].volume-slider {
    width: 100%;
    appearance: none;
    background: transparent;
    outline: none;
}

.volume-slider {
    width: 100%;
    accent-color: var(--primary-color);
    background: transparent;
    border-radius: 3px;
    height: 6px;
    margin-left: 5px;
    margin-right: 5px;
    outline: none;
    transition: accent-color 0.6s ease;
    /* Custom track and thumb styling for color gradient */
}

.volume-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

.volume-slider::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent-color);
    border: 2px dotted var(--primary-color);
    box-shadow: 0 0 6px var(--primary-glow);
    cursor: pointer;
    transition: background 0.3s;
    margin-top: -3px;
}

.volume-slider:focus::-webkit-slider-thumb {
    background: var(--secondary-color);
}

/* Firefox */
.volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--accent-color);
    border: 2px dotted var(--primary-color);
    box-shadow: 0 0 6px var(--primary-glow);
    cursor: pointer;
    transition: background 0.3s;
}

.volume-slider::-moz-range-track {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

/* Edge/IE */
.volume-slider::-ms-fill-lower {
    background: var(--primary-color);
    border-radius: 3px;
}

.volume-slider::-ms-fill-upper {
    background: var(--secondary-color);
    border-radius: 3px;
}

@media (min-width: 600px) and (max-width: 1024px) and (orientation: landscape) {
    .wheel-item {
        cursor: pointer;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    .wheel-item:hover .album-card {
        border-color: var(--secondary-color);
        box-shadow: 0 0 20px var(--secondary-glow);
        background-color: rgba(10, 10, 10, 0.8);
        transform: scale(1.05);
    }
    
    .music-player {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 300px;
        z-index: 10;
        /* Garde le style centré comme sur desktop */
    }
}

@media (max-width: 600px) {
    .music-player {
        left: 50%;
        top: auto;
        bottom: 10px;
        transform: translateX(-50%);
        width: 80vw;
        border-radius: 16px;
        padding: 16px 8px 24px 8px;
        box-sizing: border-box;
        margin-bottom: 10px;
        z-index: 0;
    }
}

.motion-circles-container {
    position: relative;
    width: 100%;
    height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.motion-circle {
    position: absolute;
    background: #eaeaea;
    border-radius: 50%;
    box-shadow: 0 0 20px #0006;
    transition: box-shadow 0.3s;
    z-index: 2;
    touch-action: none;
}
</style>