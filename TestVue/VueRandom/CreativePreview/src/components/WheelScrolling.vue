<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const rotationDegrees = ref(0)
const wheelRef = ref(null)
const isScrolling = ref(false)
const scrollTimeout = ref(null)
const scrollDirection = ref(1) // 1 for clockwise, -1 for counterclockwise
const hoveredIndex = ref(null)

// Controls for city spacing and visibility
const angleBetweenCities = computed(() => 15) // Fixed angle between cities (degrees)
const wheelRadius = 400 // Distance from center

// City names to display around the wheel
const allCities = [
    "Berlin, Germany",
    "Oslo, Norway",
    "Copenhagen, Denmark",
    "London, UK",
    "Madrid, Spain",
    "Helsinki, Finland",
    "Shanghai, China",
    "San Francisco, USA",
    "Tokyo, Japan",
    "São Paulo, Brazil",
    "Auckland, New Zealand",
    "Sydney, Australia",
    "New York, USA",
    "Stockholm, Sweden",
    "Paris, France",
    "Rome, Italy",
    "Amsterdam, Netherlands",
    "Toronto, Canada",
    "Dubai, UAE",
    "Singapore",
    "Seoul, South Korea",
    "Mumbai, India",
    "Istanbul, Turkey",
    "Cairo, Egypt",
    "Rio de Janeiro, Brazil",
    "Cape Town, South Africa",
    "Athens, Greece",
    "Mexico City, Mexico"
]

// Create extended city list for seamless rotation
const extendedCities = computed(() => {
    // Calculate how many cities we need for a full circle and some extra for seamless rotation
    const totalCitiesNeeded = Math.ceil(360 / angleBetweenCities.value) + 10 // Extra cities for smooth transitions
    const extended = []

    for (let i = 0; i < totalCitiesNeeded; i++) {
        const cityIndex = i % allCities.length
        extended.push({
            name: allCities[cityIndex],
            angle: i * angleBetweenCities.value,
            originalIndex: cityIndex,
            globalIndex: i
        })
    }

    return extended
})

// Filter cities that are currently visible on screen
const visibleCities = computed(() => {
    const currentRotation = rotationDegrees.value
    const visibleCitiesMap = new Map() // To prevent duplicates

    extendedCities.value.forEach(city => {
        // Calculate the city's current position after rotation
        const cityPosition = city.angle - currentRotation
        // Normalize the angle to 0-360 range
        let normalizedPosition = ((cityPosition % 360) + 360) % 360

        // Adjust the referential: shift by -90 degrees so that 0° is at top instead of right
        // This makes: 0° = top, 90° = right, 180° = bottom, 270° = left
        normalizedPosition = (normalizedPosition - 90 + 360) % 360        // Show cities on the right side of the wheel, accounting for item width
        // We subtract 15 degrees to ensure items are fully hidden before entering view
        if ((normalizedPosition >= 180 && normalizedPosition <= 360)) {
            // Use a key based on the normalized position to prevent duplicates
            const positionKey = Math.round(normalizedPosition / angleBetweenCities.value) * angleBetweenCities.value

            if (!visibleCitiesMap.has(positionKey) ||
                Math.abs(normalizedPosition - positionKey) < Math.abs(visibleCitiesMap.get(positionKey).currentPosition - positionKey)) {
                visibleCitiesMap.set(positionKey, {
                    ...city,
                    currentPosition: normalizedPosition + 90 // Add back 90° for positioning
                })
            }
        }
    })

    return Array.from(visibleCitiesMap.values())
})

// Calculate the currently selected city based on rotation
const selectedCityIndex = computed(() => {
    // Find the city closest to the 90-degree position (right side center in new referential)
    const targetAngle = 270 // Right center in the adjusted referential
    let closestCity = visibleCities.value[0]
    let minDistance = Infinity

    visibleCities.value.forEach(city => {
        // Calculate distance considering the adjusted referential
        const adjustedPosition = (city.currentPosition - 90 + 360) % 360
        let distance = Math.abs(adjustedPosition - targetAngle)

        // Handle wrap-around at 0°/360° boundary
        if (distance > 180) {
            distance = 360 - distance
        }

        if (distance < minDistance) {
            minDistance = distance
            closestCity = city
        }
    })

    return closestCity?.originalIndex || 0
})

// Get the currently selected city
const selectedCity = computed(() => {
    return allCities[selectedCityIndex.value]
})

// Handle wheel scroll event
const handleScroll = (event) => {
    // Determine scroll direction
    const delta = event.deltaY

    // Set scroll direction based on deltaY
    scrollDirection.value = delta > 0 ? 1 : -1

    // Update rotation - this rotates the entire wheel
    rotationDegrees.value += scrollDirection.value * (angleBetweenCities.value / 3)

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

// Handle mouse enter on city item
const handleMouseEnter = (index) => {
    hoveredIndex.value = index
}

// Handle mouse leave on city item
const handleMouseLeave = () => {
    hoveredIndex.value = null
}

onMounted(() => {
    // Add wheel event listener
    window.addEventListener('wheel', handleScroll, { passive: false })
})

onUnmounted(() => {
    // Remove wheel event listener
    window.removeEventListener('wheel', handleScroll)
    if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
    }
})
</script>

<template>
    <div class="WheelScrolling">
        <div class="scroll-hint">
            <span>Scroll to rotate the wheel</span>
        </div>

        <!-- Main wheel container - positioned to show only right side -->
        <div ref="wheelRef" class="wheel"> <!-- Individual city items positioned around the wheel -->
            <div v-for="(city, index) in visibleCities" :key="`city-${city.globalIndex}`" class="wheel-item"
                :class="{ 'active-scrolling': isScrolling }"                :style="{
                    transform: `translate(0%, -50%) rotate(${city.currentPosition}deg) translateX(${wheelRadius}px) rotate(-${city.currentPosition}deg)`
                }"@mouseenter="handleMouseEnter(index)" @mouseleave="handleMouseLeave">
                <motion tag="div" class="city-content" :class="{ 'hovered': hoveredIndex === index }"
                    :whileHover="{ scale: 1.2 }" :transition="{ type: 'spring', stiffness: 300, damping: 20 }">
                    <div class="city-card">
                        <h3>{{ city.name }}</h3>
                    </div>
                </motion>
            </div>

            <!-- Center point inside the wheel -->
            <div class="center-dot"></div>
        </div>

        <!-- Selected city display -->
        <div class="selected-city">
            <motion tag="div" :animate="{ opacity: 1, x: 0 }" :initial="{ opacity: 0, x: 20 }" :key="selectedCityIndex"
                :transition="{ duration: 0.3 }">
                <h2>{{ selectedCity }}</h2>
            </motion>
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
}

.scroll-hint {
    position: absolute;
    top: 20px;
    left: 0;
    width: 100%;
    text-align: center;
    font-family: var(--font-body);
    font-size: 1rem;
    opacity: 0.7;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        opacity: 0.4;
    }

    50% {
        opacity: 0.8;
    }

    100% {
        opacity: 0.4;
    }
}

.wheel {
    position: absolute;
    left: -1200px; /* Increased offset to ensure items can fully hide */
    width: 2400px; /* Increased width to match new offset */
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
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

.city-content {
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

.city-card {
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 6px;
    padding: 8px 12px;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(66, 184, 131, 0.3);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 0 10px rgba(66, 184, 131, 0.2);
    display: inline-block;
    max-width: 100%;
    box-sizing: border-box;
}

.city-content.hovered .city-card {
    border-color: rgba(66, 184, 131, 0.8);
    box-shadow: 0 0 20px rgba(66, 184, 131, 0.5);
    background-color: rgba(10, 10, 10, 0.8);
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
    background-color: #42b883;
    box-shadow: 0 0 20px rgba(66, 184, 131, 0.6);
    z-index: 5;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.selected-city {
    position: fixed;
    top:50%;
    right: 40px;
    height: 100%;
    width:10%;
    text-align: center;
    writing-mode: vertical-rl;
    text-orientation: upright;
    transform: translateY(-50%);
}

.selected-city h2 {
    font-family: var(--font-headings);
    font-size: 3rem;
    margin: 0;
    padding: 0;
    color: #42b883;
    text-shadow: 0 0 10px rgba(66, 184, 131, 0.4);
}
</style>