<template>
    <div class="home">
        <div class="home-header">
            <h1>Welcome to Creative Preview</h1>
            <p>This project was made to train myself in handling vue 3 and other libraries such as Motion</p>
            <p>Three different animations are available here, all exploring the scrolling motion.</p>
            <p>I will in each page showcase the effect in question and then implement a small preview of how it is done.</p>
        </div>
        <div class="preview-section">
            <h2>Available Animations</h2>
            <div class="preview-grid">
                <motion.div
                    layout
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :transition="{ duration: 0.5, delay: 0.1 }"
                >
                    <PreviewCard 
                        title="Parallax Scroll" 
                        description="Smooth animations that respond to scroll position, creating depth and engagement as users navigate the page"
                        previewClass="parallax-preview" 
                        routePath="/ParallaxScroll" 
                    />
                </motion.div>
                
                <motion.div 
                    layout
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :transition="{ duration: 0.5, delay: 0.2 }"
                >
                    <PreviewCard 
                        title="Wheel Scrolling" 
                        description="Interactive animations triggered by mouse wheel events, providing an intuitive way to navigate content"
                        previewClass="wheel-preview" 
                        routePath="/wheel" 
                    />
                </motion.div>
                
                <motion.div
                    layout
                    :initial="{ opacity: 0, scale: 0.8 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :transition="{ duration: 0.5, delay: 0.3 }"
                >
                    <PreviewCard 
                        title="Test Animation" 
                        description="Experimental animations and effects, showcasing advanced techniques and combinations"
                        previewClass="test-preview" 
                        routePath="/test" 
                    />
                </motion.div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { motion } from 'motion-v'
import PreviewCard from './PreviewCard.vue'
import '../assets/previews.css'
</script>

<style scoped>
.home {
    height:100vh;
    text-align: center;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    margin-bottom: 1rem;
    color: #2c3e50;
    font-size: 3.5rem;
}

p {
    font-family: var(--font-body);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.home-header {
    margin-bottom: 3rem;
}

.preview-section {
    margin-top: 2rem;
}

h2 {
    margin-bottom: 2rem;
    color: #2c3e50;
    position: relative;
    font-size: 2.5rem;
}

h2:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: #42b883;
}

.preview-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

@media (max-width: 768px) {
    .preview-grid {
        flex-direction: column;
        align-items: center;
    }
}
</style>
