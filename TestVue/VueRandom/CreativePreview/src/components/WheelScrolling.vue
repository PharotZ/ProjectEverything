<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { allAlbums, albumColors } from '@/assets/albumData'

const rotationDegrees = ref(0)
const wheelRef = ref(null)
const isScrolling = ref(false)
const scrollTimeout = ref(null)
const scrollDirection = ref(1) // 1 for clockwise, -1 for counterclockwise
const hoveredIndex = ref(null)

// Music player state
const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(0.5)

// Controls for album spacing and visibility
const angleBetweenalbums = computed(() => 12) // Fixed angle between albums (degrees)
const wheelRadius = 400 // Distance from center

// Create extended album list for seamless rotation
const extendedalbums = computed(() => {
    // Calculate how many albums we need for a full circle and some extra for seamless rotation
    const totalalbumsNeeded = Math.ceil(360 / angleBetweenalbums.value) // Extra albums for smooth transitions
    const extended = []

    for (let i = 0; i < totalalbumsNeeded; i++) {
        const albumIndex = i % allAlbums.length
        extended.push({
            name: allAlbums[albumIndex].name,
            audioUrl: allAlbums[albumIndex].audioUrl,
            angle: i * angleBetweenalbums.value,
            originalIndex: albumIndex,
            globalIndex: i
        })
    }

    return extended
})

// Filter albums that are currently visible on screen
const visiblealbums = computed(() => {
    const currentRotation = rotationDegrees.value
    const visiblealbumsMap = new Map() // To prevent duplicates

    extendedalbums.value.forEach(album => {
        // Calculate the album's current position after rotation
        const albumPosition = album.angle - currentRotation
        // Normalize the angle to 0-360 range
        let normalizedPosition = ((albumPosition % 360) + 360) % 360

        // Adjust the referential: shift by -90 degrees so that 0° is at top instead of right
        // This makes: 0° = top, 90° = right, 180° = bottom, 270° = left
        normalizedPosition = (normalizedPosition - 90 + 360) % 360        // Show albums on the right side of the wheel, accounting for item width
        // We subtract 15 degrees to ensure items are fully hidden before entering view
        if ((normalizedPosition >= 180 && normalizedPosition <= 360)) {
            // Use a key based on the normalized position to prevent duplicates
            const positionKey = Math.round(normalizedPosition / angleBetweenalbums.value) * angleBetweenalbums.value

            if (!visiblealbumsMap.has(positionKey) ||
                Math.abs(normalizedPosition - positionKey) < Math.abs(visiblealbumsMap.get(positionKey).currentPosition - positionKey)) {
                visiblealbumsMap.set(positionKey, {
                    ...album,
                    currentPosition: normalizedPosition + 90 // Add back 90° for positioning
                })
            }
        }
    })

    return Array.from(visiblealbumsMap.values())
})

// Calculate the currently selected album based on rotation
const selectedalbumIndex = computed(() => {
    // Find the album closest to the 90-degree position (right side center in new referential)
    const targetAngle = 270 // Right center in the adjusted referential
    let closestalbum = visiblealbums.value[0] 
    let minDistance = Infinity

    visiblealbums.value.forEach(album => {
        // Calculate distance considering the adjusted referential
        const adjustedPosition = (album.currentPosition - 90 + 360) % 360
        let distance = Math.abs(adjustedPosition - targetAngle)

        // Handle wrap-around at 0°/360° boundary
        if (distance > 180) {
            distance = 360 - distance
        }

        if (distance < minDistance) {
            minDistance = distance
            closestalbum = album
        }
    })

    return closestalbum?.originalIndex || 0
})

// Get the currently selected album
const selectedalbum = computed(() => {
    return allAlbums[selectedalbumIndex.value]
})

// Watch for album changes and load new audio
watch(selectedalbum, (newAlbum) => {
    if (audioRef.value && newAlbum) {
        audioRef.value.src = newAlbum.audioUrl
        audioRef.value.load()
        currentTime.value = 0

        // Auto-play if was playing before
        if (isPlaying.value) {
            playAudio()
        }
    }
})

// Music player functions
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
    if (isPlaying.value) {
        pauseAudio()
    } else {
        playAudio()
    }
}

const updateTime = () => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime
        duration.value = audioRef.value.duration || 0
    }
}

const seekTo = (event) => {
    if (audioRef.value && duration.value) {
        const rect = event.target.getBoundingClientRect()
        const percent = (event.clientX - rect.left) / rect.width
        const newTime = percent * duration.value
        audioRef.value.currentTime = newTime
        currentTime.value = newTime
    }
}

const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const setVolume = (event) => {
    const rect = event.target.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    volume.value = Math.max(0, Math.min(1, percent))
    if (audioRef.value) {
        audioRef.value.volume = volume.value
    }
}

// Handle wheel scroll event
const handleScroll = (event) => {
    // Determine scroll direction
    const delta = event.deltaY

    // Set scroll direction based on deltaY
    scrollDirection.value = delta > 0 ? 1 : -1

    // Update rotation - this rotates the entire wheel
    rotationDegrees.value += scrollDirection.value * (angleBetweenalbums.value / 3)

    // Visual feedback for active scrolling
    isScrolling.value = true

    // Clear previous timeout
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
    }

    // Set timeout to stop active state
    scrollTimeout.value = setTimeout(() => {
        isScrolling.value = false
    }, 200)

    event.preventDefault()
}

// Handle mouse enter on album item
const handleMouseEnter = (index) => {
    hoveredIndex.value = index
}

// Handle mouse leave on album item
const handleMouseLeave = () => {
    hoveredIndex.value = null
}

// Handle image loading errors
const handleImageError = (event) => {
    // Fallback to a default cover image
    event.target.src = '/covers/default-cover.jpg'
}

onMounted(() => {
    // Add wheel event listener
    window.addEventListener('wheel', handleScroll, { passive: false })

    // Setup audio event listeners
    if (audioRef.value) {
        audioRef.value.addEventListener('timeupdate', updateTime)
        audioRef.value.addEventListener('ended', () => {
            isPlaying.value = false
            currentTime.value = 0
        })
        audioRef.value.volume = volume.value
    }
})

onUnmounted(() => {
    // Remove wheel event listener
    window.removeEventListener('wheel', handleScroll)
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
    }

    // Clean up audio listeners
    if (audioRef.value) {
        audioRef.value.removeEventListener('timeupdate', updateTime)
    }
})

// Get current album colors
const currentColors = computed(() => {
    const albumName = selectedalbum.value?.name
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
</script>

<template>
    <div class="WheelScrolling" :style="dynamicStyles">
        <!-- Hidden audio element -->
        <audio ref="audioRef" preload="metadata"></audio>

        <!-- Main wheel container - positioned to show only right side -->
        <div ref="wheelRef" class="wheel">
            <!-- Individual album items positioned around the wheel -->
            <div v-for="(album, index) in visiblealbums" :key="`album-${album.globalIndex}`" class="wheel-item"
                :class="{ 'active-scrolling': isScrolling, 'selected': album.originalIndex === selectedalbumIndex }"
                :style="{
                    transform: `translate(0%, -50%) rotate(${album.currentPosition}deg) translateX(${wheelRadius}px) rotate(-${album.currentPosition}deg)`
                }"
                @mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave">
                <div class="album-content" :class="{ 'hovered': hoveredIndex === index }">
                    <div class="album-card">
                        <h3>{{ album.name }}</h3>
                    </div>
                </div>
            </div>

            <!-- Center point inside the wheel -->
            <div class="center-dot"></div>
        </div>

        <!-- Music Player -->
        <div class="music-player">
            <div class="player-header">
                <div class="album-cover">
                    <img :src="selectedalbum.coverUrl" :alt="selectedalbum.name" @error="handleImageError" />
                    <div class="cover-overlay" v-if="!isPlaying">
                        <span class="play-icon">▶️</span>
                    </div>
                </div>
                <div class="player-info">
                    <h3>{{ selectedalbum.name }}</h3>
                </div>
            </div>
            
            <div class="player-controls">
                <button @click="togglePlayPause" class="play-pause-btn">
                    <span v-if="isPlaying">⏸️</span>
                    <span v-else>▶️</span>
                </button>
            </div>
            
            <div class="player-progress">
                <span class="time">{{ formatTime(currentTime) }}</span>
                <div class="progress-bar" @click="seekTo">
                    <div class="progress-track">
                        <div class="progress-fill" :style="{ width: duration ? (currentTime / duration) * 100 + '%' : '0%' }"></div>
                    </div>
                </div>
                <span class="time">{{ formatTime(duration) }}</span>
            </div>
            
            <div class="volume-control">
                <span>🔊</span>
                <div class="volume-bar" @click="setVolume">
                    <div class="volume-track">
                        <div class="volume-fill" :style="{ width: volume * 100 + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.WheelScrolling {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #0a0a0a;
    color: white;
    position: relative;
    overflow: hidden;
    transition: all 0.6s ease;
}

@keyframes pulse {
    0% {
        opaalbum: 0.4;
    }

    50% {
        opaalbum: 0.8;
    }

    100% {
        opaalbum: 0.4;
    }
}

.wheel {
    position: absolute;
    left: -1500px;
    /* Increased offset to ensure items can fully hide */
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
    width: fit-content;
    height: fit-content;
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
    transform-origin: center;
}

.album-card {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 6px;
    padding: 8px 12px;
    backdrop-filter: blur(5px);
    border: 1px solid var(--primary-color);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 0 10px var(--primary-glow);
    display: inline-block;
    max-width: 100%;
    box-sizing: border-box;
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

.center-dot {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--primary-color);
    box-shadow: 0 0 20px var(--primary-glow);
    z-index: 0;
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;
}

.music-player {
    position: fixed;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--primary-color);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-width: 400px;
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
    border: 2px solid var(--primary-color);
    transition: border-color 0.6s ease;
}

.album-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.album-cover:hover img {
    transform: scale(1.05);
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

.play-pause-btn:hover {
    transform: scale(1.1);
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
</style>