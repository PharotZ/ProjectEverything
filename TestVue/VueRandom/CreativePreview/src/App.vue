<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="app-container">
    <header v-if="route.path !== '/'" class="site-header">
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/wheel">Music Player</router-link> |
        <router-link to="/fashion">Fashion Table</router-link> |
        <router-link to="/contact">Contact</router-link>
      </nav>
    </header>
    <main>
      <router-view :key="$route.path"></router-view>
    </main>
  </div>
</template>


<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
  /* Dots every 32px, 2px diameter, white with a bit of transparency */
  background: radial-gradient(circle, #fff 1px, transparent 1.5px);
  background-size: 32px 32px;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  z-index: 1000; /* Ensure navbar is above everything */
}

nav {
  text-align: center;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem;
  font-family: var(--font-headings);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

nav a.router-link-active {
  border-bottom: 2px solid white;
}

main {
  flex: 1; /* Add spacing for the fixed header */ /* Add some additional padding */
}

@media screen and (max-width: 600px) {
  .site-header {
    height: 50px;
    padding-top: 20px;
  }

  nav a {
    font-size: 0.8rem;
  }

  main {
    padding-top: 12px;
  }
}


</style>
