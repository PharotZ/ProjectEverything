<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  setup() {
    const globe = ref(null)
    const scrollY = ref(0)

    // Détection de la taille d'écran
    const isSmallScreen = computed(() => window.innerHeight < 600)

    // Constants for animation thresholds - ajustés pour petits écrans
    const START_SCALE = 1
    const MAX_SCALE = 1.8
    const FADE_START = computed(() => isSmallScreen.value ? 100 : 200)
    const FADE_END = computed(() => isSmallScreen.value ? 300 : 600)
    const MENU_APPEAR = computed(() => isSmallScreen.value ? 150 : 400)

    // Calculate globe scale based on scroll position
    const globeScale = computed(() => {
      return Math.min(MAX_SCALE, START_SCALE + (scrollY.value * 0.002))
    })

    // Calculate blur effect on globe
    const globeBlur = computed(() => {
      if (scrollY.value < FADE_START.value) return 0
      return Math.min(10, (scrollY.value - FADE_START.value) / 20)
    })

    // Calculate globe opacity based on scroll position
    const globeOpacity = computed(() => {
      if (scrollY.value < FADE_START.value) return 1
      if (scrollY.value > FADE_END.value) return 0
      return 1 - ((scrollY.value - FADE_START.value) / (FADE_END.value - FADE_START.value))
    })

    // Calculate menu opacity based on scroll position
    const menuOpacity = computed(() => {
      if (scrollY.value < MENU_APPEAR.value) return 0
      if (scrollY.value > FADE_END.value) return 1
      return (scrollY.value - MENU_APPEAR.value) / (FADE_END.value - MENU_APPEAR.value)
    })

    // Update scroll position
    const handleScroll = () => {
      scrollY.value = window.scrollY
    }

    onMounted(() => {
      window.scrollTo(0, 0)
      window.addEventListener('scroll', handleScroll)
      handleScroll()
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
    <!-- Down arrow at the bottom, fades with globe -->
    <div class="down-arrow" :style="{ opacity: globeOpacity }">
      <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M7.119 8h9.762a1 1 0 0 1 .772 1.636l-4.881 5.927a1 1 0 0 1-1.544 0l-4.88-5.927A1 1 0 0 1 7.118 8Z" />
      </svg>
    </div>
    <!-- Menu that appears after scrolling -->
    <div class="menu-container" :style="{ opacity: menuOpacity, pointerEvents: menuOpacity > 0.5 ? 'auto' : 'none' }">
      <h1>Welcome to .Prev</h1>
      <p>Ce projet a été créé a la base dans l'idée de m'entraîner à manipuler Vue 3 et d'autres bibliothèques tel
        que Motion.</p>
      <p>Maintenant j'ai juste envie de créer une sorte de hub qui regroupe plein de fonctionnalités</p>
      <p>Si vous avez des suggestions n'hésitez pas à m'en faire part ! (y'a un form aussi dans la page de contact si
        vous voulez)</p>
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
.down-arrow {
  position: fixed;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
  transition: opacity 0.3s;
  animation: arrow-bounce 1.5s infinite;
}

@keyframes arrow-bounce {

  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(16px);
  }
}

.parallax-container {
  height: 300vh;
  /* Tall container to allow scrolling */
  position: relative;
  overflow: hidden;
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

  font-size: 3rem;
  color: #475281;
  margin-bottom: 40px;
  text-shadow: 0 0 10px rgba(119, 117, 197, 0.66);
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
  border-radius: 8px;
  padding: 25px;
  width: 300px;
  backdrop-filter: blur(0.5px);
  margin: 10px;
  border: 2px dotted rgba(119, 117, 197, 0.66);
  cursor: pointer;
}

.menu-item h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #475281;
  font-family: var(--font-headings);
}

.menu-item p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  font-family: var(--font-body);
}

@media (max-width: 600px) {
  .menu-container {
    padding-top: 30px;
    /* Lower the content further from the top */
  }

  .menu-container h1 {
    font-size: 2rem;
    /* Make the title smaller */
    margin-top: 0px;
    /* Adjust margin for smaller screens */
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
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    border: 2px dotted rgba(59, 84, 186, 0.377);
  }

  .menu-item h3 {
    font-size: 1.1rem;
    margin: 0;
    color: #475281;
  }

  .menu-item p {
    display: none;
    /* Hide description on phone */
  }
}

/* Media query pour tablettes et téléphones en mode horizontal */
@media (max-height: 600px) and (orientation: landscape) {
  .parallax-container {
    height: 200vh; /* Réduit la hauteur pour moins de scroll */
    margin-top: -20px;
    padding-top: 20px;
  }

  .globe-container {
    top: 20px;
    height: calc(100vh - 20px);
  }

  .globe {
    max-width: 50%; /* Globe plus petit en mode paysage */
    max-height: 60vh;
  }

  .menu-container {
    top: 20px;
    height: calc(100vh - 20px);
    padding: 10px;
    justify-content: flex-start; /* Aligne le contenu vers le haut */
    padding-top: 20px;
  }

  .menu-container h1 {
    font-size: 2rem; /* Titre plus petit */
    margin-bottom: 20px;
  }

  .menu-container p {
    font-size: 0.9rem; /* Texte plus petit */
    margin-bottom: 8px;
    display: none; /* Cache les paragraphes descriptifs pour gagner de l'espace */
  }

  .menu-items {
    gap: 15px;
    max-width: 100%;
    margin-top: 10px;
  }

  .menu-item {
    width: 200px; /* Plus petit */
    padding: 15px;
    margin: 5px;
  }

  .menu-item h3 {
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  .menu-item p {
    display: block; /* Réaffiche les descriptions des items */
    font-size: 0.8rem;
    line-height: 1.2;
  }

  .down-arrow {
    bottom: 5px;
  }

  /* Ajustements spécifiques pour les très petites hauteurs */
  @media (max-height: 450px) {
    .menu-container h1 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    
    .menu-items {
      gap: 10px;
    }
    
    .menu-item {
      width: 180px;
      padding: 10px;
    }
    
    .menu-item h3 {
      font-size: 1rem;
    }
    
    .menu-item p {
      font-size: 0.7rem;
    }
  }
}

/* Media query spécifique pour les téléphones en mode horizontal */
@media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {
  .menu-container {
    padding-top: 10px;
  }
  
  .menu-container h1 {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
  
  .menu-items {
    flex-direction: row; /* Garde les items en ligne */
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .menu-item {
    width: 150px;
    padding: 12px;
  }
  
  .menu-item h3 {
    font-size: 1rem;
  }
  
  .menu-item p {
    font-size: 0.75rem;
  }
}
</style>