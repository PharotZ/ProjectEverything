<script setup lang="ts">
import { ref } from 'vue'
import { instagramIcon, githubIcon, linkedinIcon, formIcon, vueIcon, motionIcon, libraryIcon } from '../assets/icons'

const scriptURL = 'https://script.google.com/macros/s/AKfycbxmnQZxiMbSn5OS_ucHtgPQ2aYc9Qgy0J5JVsa5zVCQO_35SY8H4ybfERfnVvgVmgnI/exec'

const formRef = ref<HTMLFormElement|null>(null)

async function submitForm() {
    if (!formRef.value) return
    try {
        await fetch(scriptURL, { method: 'POST', body: new FormData(formRef.value) })
        window.location.reload()
    } catch (error) {
    console.error('Error!', error)
    }
}

const planets = [
    { icon: githubIcon, label: 'GitHub', link: 'https://github.com/PharotZ', color: '#333', radius: 80, speed: 14, angle: 0 },
    { icon: instagramIcon, label: 'Instagram', link: 'https://www.instagram.com/t4xyo', color: '#E4405F', radius: 128, speed: 18, angle: 80 },
    { icon: linkedinIcon, label: 'LinkedIn', link: 'https://www.linkedin.com/in/theo-baron-72944929b', color: '#0077B5', radius: 176, speed: 16, angle: 160 },
    { icon: formIcon, label: 'Contact', link: '#', color: '#95a8ff', radius: 228, speed: 22, angle: 240 },
    { icon: libraryIcon, label: 'Library', link: '#', color: '#ff5722', radius: 300, speed: 26, angle: 300 }
]

const subPlanets = [
    { icon: vueIcon, label: 'Vue.js', link: 'https://vuejs.org', color: '#42b883', radius: 45, speed: 6, angle: 0 },
    { icon: motionIcon, label: 'Motion', link: 'https://motion.dev/docs', color: '#fffb00', radius: 45, speed: 6, angle: 180 },
]

const showSubPlanets = ref(false)

const showForm = ref(false)

function getPlanetStyle(planet, idx) {
    return {
        '--radius': `${planet.radius}px`,
        '--angle': `${planet.angle}deg`,
        '--speed': `${planet.speed}s`,
        '--planet-color': planet.color
    }
}

function handlePlanetClick(planet) {
    if (planet.label === 'Library') {
        showSubPlanets.value = !showSubPlanets.value
        return
    }
    if (planet.link && planet.link !== '#') {
        window.open(planet.link, '_blank')
    } else if (planet.label === 'Contact') {
        showForm.value = true
    }
}

function handleSubPlanetClick(subPlanet) {
    if (subPlanet.link) {
        window.open(subPlanet.link, '_blank')
    }
}

function closeForm() {
    showForm.value = false
}
</script>

<template>
    <div class="solar-system-container">
        <div class="solar-system">
            <!-- Centre : GIF -->
            <div class="center-sun">
                <router-link to="/secret" style="cursor:default">
                    <img src="../assets/Globe.gif" alt="center gif" class="center-gif" />
                </router-link>
            </div>
            <!-- Planètes -->
            <div v-for="(planet, idx) in planets" :key="planet.label" class="planet-orbit"
                :style="getPlanetStyle(planet, idx)" @click="handlePlanetClick(planet)">
                <template v-if="planet.label !== 'Library'">
                    <div class="planet-icon" v-html="planet.icon"></div>
                </template>
                <template v-else>
                    <div class="planet-icon">
                        <span v-html="planet.icon"></span>
                        <div v-if="showSubPlanets" class="sub-solar-system">
                            <div v-for="(sub, subIdx) in subPlanets" :key="sub.label" class="sub-planet-orbit"
                                :style="getPlanetStyle(sub, subIdx)" @click.stop="handleSubPlanetClick(sub)">
                                <div class="sub-planet-icon" v-html="sub.icon"></div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Modal Formulaire via Teleport -->
        <teleport to="body">
            <div v-if="showForm" class="form-modal" @click.self="closeForm">
                <div class="form-content">
                    <button class="close-btn" @click="closeForm">×</button>
                    <h1><span class="icon-label">Feedback Form</span></h1>
                    <form ref="formRef" enctype="text/plain" @click.stop name="contact-form" @submit.prevent="submitForm">
                        <textarea id="nom" placeholder="Qui es-tu?" rows="1" cols="25" name="nom"></textarea>
                        <textarea placeholder="Ton feedback..." rows="4" cols="25" name="feedback"></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
</template>

<style scoped>
/* Sous-planètes autour de Library */
.sub-solar-system {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    pointer-events: none;
}
.sub-planet-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: orbit-sub-planet var(--speed) linear infinite;
    --angle: 0deg;
    --radius: 60px;
    animation-delay: calc(var(--angle) / 360 * var(--speed) * -1);
    pointer-events: auto;
    z-index: 20;
}
.sub-planet-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--planet-color, #fff);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid #fff3;
}

.sub-planet-icon svg {
    width: 16px;
    height: 16px;
    fill: white;
}
@keyframes orbit-sub-planet {
    0% {
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
    }
    100% {
        transform: translate(-50%, -50%) rotate(calc(360deg + var(--angle))) translateX(var(--radius)) rotate(calc(-360deg - var(--angle)));
    }
}
.solar-system-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
}

.solar-system {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.center-sun {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 40px 10px #fff2;
}

.center-gif {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.planet-orbit {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: orbit-planet var(--speed) linear infinite;
    /* Place at correct radius and angle */
    --angle: 0deg;
    --radius: 120px;
    /* Start at the right angle */
    animation-delay: calc(var(--angle) / 360 * var(--speed) * -1);
}

@keyframes orbit-planet {
    0% {
        transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
    }

    100% {
        transform: translate(-50%, -50%) rotate(calc(360deg + var(--angle))) translateX(var(--radius)) rotate(calc(-360deg - var(--angle)));
    }
}
.planet-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--planet-color, #fff);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid #fff3;
}

.planet-icon svg {
    width: 28px;
    height: 28px;
    fill: white;
}

.planet-label {
    font-size: 13px;
    color: white;
    text-align: center;
    margin-top: 6px;
    background: rgba(0, 0, 0, 0.6);
    padding: 2px 8px;
    border-radius: 8px;
    pointer-events: none;
    user-select: none;
}

@media (max-width: 600px) {
    .solar-system {
        width: 320px;
        height: 320px;
    }

    .center-sun {
        width: 60px;
        height: 60px;
    }

    .planet-icon {
        width: 32px;
        height: 32px;
    }

    .planet-label {
        font-size: 10px;
        padding: 2px 4px;
    }
}
/* ...existing code... */

.form-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.form-content {
    background: #1a1a2e;
    border: 2px dotted #95a8ff;
    border-radius: 16px;
    padding: 32px;
    max-width: 400px;
    width: 90vw;
    position: relative;
}

.close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.form-content h1 {
    color: #95a8ff;
    margin-bottom: 24px;
    text-align: center;
}

.form-content form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-content textarea {
    background: #0f0f1e;
    border: 1px solid #95a8ff;
    border-radius: 8px;
    padding: 12px;
    color: white;
    resize: vertical;
    font-family: inherit;
}

.form-content textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.form-content button[type="submit"] {
    background: #95a8ff;
    color: #1a1a2e;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s ease;
}

.form-content button[type="submit"]:hover {
    background: #7a8cff;
}
</style>
