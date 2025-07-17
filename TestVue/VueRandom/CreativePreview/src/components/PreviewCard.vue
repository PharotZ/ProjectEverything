<script setup>
import { ref, onMounted } from 'vue'


const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    previewClass: {
        type: String,
        required: true
    },
    routePath: {
        type: String,
        required: true
    }
})

const isHovered = ref(false)
const isLoaded = ref(false)

onMounted(() => {
    // Set isLoaded to true after a brief delay to trigger mount animation
    setTimeout(() => {
        isLoaded.value = true
    }, 100)
})
</script>

<template>
    <motion tag="div" class="preview-card" @mouseenter="isHovered = true" @mouseleave="isHovered = false" :animate="{
        height: isHovered ? '550px' : '350px',
        scale: isLoaded ? 1 : 0.8,
        opacity: isLoaded ? 1 : 0
    }" :transition="{ duration: 0.3 }">
        <div class="preview-image" :class="previewClass"></div>

        <motion class="preview-content" :animate="{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20
        }" :initial="{ opacity: 0, y: 20 }" :transition="{ duration: 0.3 }">
            <h3>{{ title }}</h3>
            <p>{{ description }}</p>
            <router-link :to="routePath" class="card-link">
                <div class="preview-button">Try it</div>
            </router-link>
        </motion>
    </motion>
</template>

<style scoped>
.card-link {
    text-decoration: none;
    display: block;
    margin: 1rem;
    color: inherit;
    /* Use the parent element's color */
    cursor: pointer;
}

.preview-card {
    width: 300px;
    height: 250px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    cursor: pointer;
    background-color: #2c3e50;
    transition: transform 0.3s ease;
}

.preview-card:hover {
    transform: translateY(-5px);
}

.preview-image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.preview-content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
}

.preview-content h3 {
    margin: 0;
    font-size: 1.5rem;
    margin-bottom: 10px;
    font-family: var(--font-headings);
}

.preview-content p {
    margin: 0;
    font-size: 0.9rem;
    font-family: var(--font-body);
    margin-bottom: 15px;
}

.preview-button {
    display: inline-block;
    background-color: #42b883;
    color: white;
    padding: 8px 20px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.2s ease;
}

.preview-button:hover {
    background-color: #3aa876;
}
</style>
