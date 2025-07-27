<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  setup() {
    const globe = ref(null)
    const scrollY = ref(0)

    // Constants for animation thresholds
    const START_SCALE = 1
    const MAX_SCALE = 1.8
    const FADE_START = 200
    const FADE_END = 600
    const MENU_APPEAR = 400

    // Calculate globe scale based on scroll position
    const globeScale = computed(() => {
      // Start at 1, grow to MAX_SCALE as scroll increases
      return Math.min(MAX_SCALE, START_SCALE + (scrollY.value * 0.002))
    })
    // Calculate blur effect on globe
    const globeBlur = computed(() => {
      if (scrollY.value < FADE_START) return 0
      // Add blur effect as globe fades out
      return Math.min(10, (scrollY.value - FADE_START) / 20)
    })

    // Calculate globe opacity based on scroll position
    const globeOpacity = computed(() => {
      if (scrollY.value < FADE_START) return 1
      if (scrollY.value > FADE_END) return 0
      // Gradually fade out between FADE_START and FADE_END
      return 1 - ((scrollY.value - FADE_START) / (FADE_END - FADE_START))
    })

    // Calculate menu opacity based on scroll position
    const menuOpacity = computed(() => {
      if (scrollY.value < MENU_APPEAR) return 0
      if (scrollY.value > FADE_END) return 1
      // Gradually fade in between MENU_APPEAR and FADE_END
      return (scrollY.value - MENU_APPEAR) / (FADE_END - MENU_APPEAR)
    })    // Update scroll position
    const handleScroll = () => {
      scrollY.value = window.scrollY
      console.log('Scrolling, Y:', scrollY.value)
    }

    onMounted(() => {
      // Reset scroll position when component is mounted
      window.scrollTo(0, 0)
      window.addEventListener('scroll', handleScroll)
      handleScroll() // Initialize on mount
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      globe,
      globeScale,
      globeOpacity,
      menuOpacity,
      globeBlur,
    }
  }
}
</script>

<template>
  <div class="parallax-container">
    <!-- Globe image that will grow and fade -->
    <div class="globe-container" :style="{ opacity: globeOpacity }">
      <img ref="globe" src="../assets/Globe.gif" alt="Globe" class="globe" :style="{
        transform: `scale(${globeScale})`,
        filter: `blur(${globeBlur}px)`
      }" />
    </div>
    <!-- Menu that appears after scrolling -->
    <div class="menu-container" :style="{ opacity: menuOpacity }">
      <h1>Welcome to Creative Preview</h1>
      <p>Ce projet a été créé a la base dans l'idée de m'entraîner à manipuler Vue 3 et d'autres bibliothèques telles que Motion.</p>
      <p>Maintenant j'ai juste envie de créer une sorte de hub qui regroupe plein de fonctionnalités</p>
      <p>Si vous avez des suggestions n'hésitez pas à m'en faire part ! (y'a un form aussi dans la page de contact si vous voulez)</p>
      <div class="menu-items">
        <router-link to="/wheel" class="menu-item">
          <h3>Music Player</h3>
          <p>Un aperçu de mes albums préférés avec un morceau de chaque album a lire</p>
        </router-link>

        <router-link to="/fashion" class="menu-item">
          <h3>Fashion Table</h3>
          <p>Un tableau intéractif de marques à suivre</p>
        </router-link>

        <router-link to="/contact" class="menu-item">
          <h3>Contact Page</h3>
          <p>Un petit portfolio avec form pour me contacter</p>
        </router-link>
      </div>
    </div>
  </div>
</template>



<style scoped>
.parallax-container {
  height: 300vh;
  /* Tall container to allow scrolling */
  position: relative;
  overflow: hidden;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -40px;
  /* Offset the main margin-top to keep proper positioning */
  padding-top: 40px;
  /* Add padding to compensate for the offset */
}

.globe-container {
  position: fixed;
  top: 40px;
  /* Added space for the navbar */
  left: 0;
  width: 100%;
  height: calc(100vh - 40px);
  /* Adjusted height to account for navbar */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.globe {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
  transition: transform 0.3s ease, filter 0.3s ease;
  transform-origin: center center;
}

.menu-container {
  position: fixed;
  top: 40px;
  /* Added space for the navbar */
  left: 0;
  width: 100%;
  height: calc(100vh - 40px);
  /* Adjusted height to account for navbar */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
  color: white;
  text-align: center;
  padding: 20px;
  transition: opacity 0.3s ease;
}

.menu-container h1 {
  margin-top: 70px;
  font-size: 3rem;
  color:#475281;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-family: var(--font-headings);
}

.menu-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  max-width: 1200px;
}

.menu-item {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 25px;
  width: 300px;
  backdrop-filter: blur(10px);
  margin: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.menu-item h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color:#475281;
  font-family: var(--font-headings);
}

.menu-item p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  font-family: var(--font-body);
}

@media (max-width: 600px) {
  .menu-container {
    padding-top: 30px; /* Lower the content further from the top */
  }
  .menu-container h1 {
    font-size:2rem; /* Make the title smaller */
    margin-top: 0px; /* Adjust margin for smaller screens */
    margin-bottom: 24px;
  }
  .menu-items {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  .menu-item {
    width: 90vw;
    min-width: 0;
    padding: 18px 0;
    margin: 0 auto;
    font-size: 1.1rem;
    text-align: center;
    background-color: rgba(255,255,255,0.08);
    border-radius: 8px;
    border: 1px solid rgba(59, 84, 186, 0.377);
  }
  .menu-item h3 {
    font-size: 1.1rem;
    margin: 0;
    color: #475281;
  }
  .menu-item p {
    display: none; /* Hide description on phone */
  }
}
</style>