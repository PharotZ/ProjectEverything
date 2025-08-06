<script setup>
import { ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

const allBrands = [
  {
    label: "Post Archive Faction",
    facts: ["Fondée en Corée du Sud", "Design technique et expérimental", "Très populaire dans le streetwear"],
    wishlist: ["8.0 Parka Center (Black)", "DV + PAF Junya Racer Off-Black/D+ Gray Gradient"],
    shops: ["Séoul", "Online"],
    images: [
      "/clothes/8.0OPC-B1.webp",
      "/clothes/JUNYA_PAF_OFFBLACK1.webp"
    ],
    links: { website: "https://postarchivefaction.com", instagram: "https://instagram.com/postarchivefaction" }
  },
  {
    label: "MM6",
    facts: ["Maison Margiela ligne 6", "Approche déstructurée", "Célèbre pour ses accessoires innovants"],
    wishlist: ["Sneakers ACS Pro MM6 x Salomon", "Jean droit"],
    shops: ["Paris", "Tokyo", "Online"],
    images: [
      "/clothes/SalomonMM6.jpg",
      "/clothes/JeanDroit.jpg"
    ],
    links: { website: "https://maisonmargiela.com/en-us/mm6", instagram: "https://instagram.com/mm6maisonmargiela" }
  },
  {
    label: "Badson",
    facts: ["Marque émergente", "Focus sur la qualité et le minimalisme"],
    wishlist: ["“SPEAKER” (2024)", "CHERRY BLOSSOM ‘OVERGROWTH’ DENIM PANTS"],
    shops: ["Paris", "Online"],
    images: [
      "/clothes/SPEAKER.jpeg",
      "/clothes/CherryBlossom.webp"
    ],
    links: { website: "https://badson.us", instagram: "https://instagram.com/badson.us" }
  },
  {
    label: "Projectisr",
    facts: ["Designs avant-gardistes"],
    wishlist: ["Chemise oversize", "Pantalon Projectisr"],
    shops: ["Séoul", "Online"],
    images: [
      "/clothes/Distressed.webp",
      "/clothes/Asymetric.webp"
    ],
    links: { website: "https://projectisr.com", instagram: "https://instagram.com/projectisr_official" }
  },
  {
    label: "Racerworldwide",
    facts: ["Y2K & Grunge", "Jeans, fourrures et vestes"],
    wishlist: ["Veste Racing", "T-shirt logo"],
    shops: ["Londres", "Online"],
    images: [
      "/clothes/CamoGilet.webp",
      "/clothes/GoldEarpods.webp",
      "/clothes/RustDenim.webp"
    ],
    links: { website: "https://racerworldwide.com", instagram: "https://instagram.com/racerworldwide" }
  },
  {
    label: "kuurth",
    facts: ["Esthétique médiévale", "Silverware"],
    wishlist: ["Veste tech", "Pantalon cargo"],
    shops: ["Berlin", "Online"],
    images: [
      "/clothes/Baco.png",
      "/clothes/Ecstasy.png"
    ],
    links: { website: "https://kuurth.com", instagram: "https://instagram.com/kuurth.co" }
  },
  {
    label: "hillllside",
    facts: ["Influence outdoor", "Vestes techniques"],
    wishlist: ["Invisibility Jacket"],
    shops: ["Genève", "Online"],
    images: [
      "/clothes/Invisibility.png",
    ],
    links: { website: "https://hillsidestudio.store/?fbclid=PAZXh0bgNhZW0CMTEAAadvxG_E9Ot88DOR7KiVgQTcZyLUx7Ti4DYhLyFUFQET-KL2eS3Q6i56So4YZA_aem_1PA6Yhq__niGXG5boXEQcw", instagram: "https://instagram.com/hillllside" }
  },
  {
    label: "leonmanuelblanck",
    facts: ["Créateur indépendant", "Pièces faites main"],
    wishlist: ["Distrortion Tall Boots RSRV"],
    shops: ["Strasbourg", "Online"],
    images: [
      "/clothes/DistortionBoot.webp",
      "/clothes/DistortionJacket.jpg",
      "/clothes/DistortionStraitJacket.webp",
      "/clothes/FractureRing.webp"
    ],
    links: { website: "https://leonmanuelblanck.shop", instagram: "https://instagram.com/leonmanuelblanck" }
  },
  {
    label: "julid1101",
    facts: ["Style urbain", "Créé par l'artiste Cherifkhris"],
    wishlist: ["Dot Jacket", "Cardigan TAIDHTH"],
    shops: ["Online"],
    images: [
      "/clothes/DotJacket.png",
      "/clothes/TAHDITH.png"
    ],
    links: { website: "https://julid1101.com", instagram: "https://instagram.com/julid1101" }
  }
]

const tabs = allBrands
const selectedTab = ref(tabs[0])
const showVisuels = ref(false)
const imageIndex = ref(0)

function openVisuels() {
  imageIndex.value = 0
  showVisuels.value = true
}

function nextImage() {
  if (!selectedTab.value.images) return
  imageIndex.value = (imageIndex.value + 1) % selectedTab.value.images.length
}

function prevImage() {
  if (!selectedTab.value.images) return
  imageIndex.value =
    (imageIndex.value - 1 + selectedTab.value.images.length) % selectedTab.value.images.length
}


</script>

<template>
  <div class="table-container">
    <div class="container">
      <nav class="nav">
        <ul class="tabs-container">
          <motion.li v-for="item in tabs" :key="item.label" tag="li" class="tab" :initial="false" :animate="{
            backgroundColor: item.label === selectedTab.label ? '#eee' : '#eee0'
          }" @click="selectedTab = item">
            {{ item.label }}
            <motion.div v-if="item.label === selectedTab.label" class="underline" layout-id="underline"
              id="underline" />
          </motion.li>
        </ul>
      </nav>
      <main class="dashboard-container">
        <AnimatePresence mode="wait">
          <motion.div :key="selectedTab ? selectedTab.label : 'empty'" :initial="{ y: 10, opacity: 0 }"
            :animate="{ y: 0, opacity: 1 }" :exit="{ y: -10, opacity: 0 }" :transition="{ duration: 0.2 }"
            class="brand-dashboard">
            <div class="dashboard-grid">
              <section class="dashboard-corner">
                <h3>À savoir</h3>
                <ul v-if="selectedTab && selectedTab.facts">
                  <li v-for="fact in selectedTab.facts" :key="fact">{{ fact }}</li>
                </ul>
                <span v-else>Aucune information disponible.</span>
              </section>
              
              <section class="dashboard-corner">
                <h3>Wishlist</h3>
                <ul v-if="selectedTab && selectedTab.wishlist">
                  <li v-for="wish in selectedTab.wishlist" :key="wish">{{ wish }}</li>
                </ul>
                <span v-else>Rien pour l'instant.</span>
              </section>

              <!-- Conteneur pour shops et liens côte à côte sur mobile -->
              <div class="shops-links-container">
                <section class="dashboard-corner">
                  <h3>Shops</h3>
                  <ul v-if="selectedTab && selectedTab.shops">
                    <li v-for="shop in selectedTab.shops" :key="shop">{{ shop }}</li>
                  </ul>
                  <span v-else>Aucun shop connu.</span>
                </section>
                
                <section class="dashboard-corner">
                  <h3>Liens</h3>
                  <ul v-if="selectedTab && selectedTab.links">
                    <li v-if="selectedTab.links.website">
                      <a :href="selectedTab.links.website" target="_blank" rel="noopener">Site officiel</a>
                    </li>
                    <li v-if="selectedTab.links.instagram">
                      <a :href="selectedTab.links.instagram" target="_blank" rel="noopener">Instagram</a>
                    </li>
                  </ul>
                  <span v-else>Aucun lien disponible.</span>
                </section>
              </div>

              <section class="dashboard-corner dashboard-visuels-btn">
                <button class="visuels-btn" @click="openVisuels">
                  Voir les visuels
                </button>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <!-- Section visuels à part -->
      <div v-if="showVisuels" class="visuels-modal">
        <div v-if="selectedTab.images && selectedTab.images.length" class="carousel">
          <div class="carousel-mid">
            <div class="carousel-count">{{ imageIndex + 1 }} / {{ selectedTab.images.length }}</div>
            <div class="carousel-image">
              <img :src="selectedTab.images[imageIndex]" alt="Visuel" />
            </div>
          </div>
          <div class="carousel-actions">
            <button class="carousel-btn" @click="prevImage">&#8592;</button>
            <button class="close-btn" @click="showVisuels = false">Fermer</button>
            <button class="carousel-btn" @click="nextImage">&#8594;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.table-container {
  display: flex;
  align-items: center;
  min-height: 95vh;
  width: 100vw;
  height: 95vh;
  /* Fix vertical scroll */
  overflow: hidden;
  /* Prevent scrolling */
  margin-top: 20px;
}

.container {
  width: 95vw;
  max-width: 100vw;
  max-height: 100vh;
  border: 2px dotted #475281;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-top: 0;
  /* Remove margin to fix scroll */
}

.nav {
  border-radius: 10px 10px 0 0;
  border-bottom: 1px dotted #475281;
  min-height: 44px;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 0;
}

.tabs-container {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  width: auto;
  overflow-y: hidden;
  /* <-- Fix: let tabs grow only as needed */
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #475281 #22263a;
  -webkit-overflow-scrolling: touch;
}

.tabs-container::-webkit-scrollbar {
  height: 6px;
  background: #22263a;
  border-radius: 4px;
}

.tabs-container::-webkit-scrollbar-thumb {
  background: #475281;
  border-radius: 4px;
}

.tab {
  list-style: none;
  margin: 0;
  font-weight: 500;
  font-size: 15px;
  border-radius: 5px 5px 0 0;
  padding: 10px 15px;
  position: relative;
  background: #22263a;
  cursor: pointer;
  height: 44px;
  display: flex;
  align-items: center;
  user-select: none;
  color: #fff;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
  min-width: 0;
  flex: none;
  /* <-- Fix: tabs only as wide as their content */
  width: auto;
}

.tab:hover {
  color: #b7ac0f;
}

.tab[style*="background-color: rgb(238, 238, 238)"] {
  background-color: #000 !important;
  color: #b7ac0f !important;
}

.underline {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #42b883;
}

.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin:10px;
}

.brand-dashboard {
  background: none;         /* Plus de fond */
  border-radius: 16px;
  padding: 32px 24px;
  min-width: 260px;
  max-width: 600px;         /* Moins large */
  width: 600px;
  box-shadow: none;         /* Plus d'ombre */
  height: fit-content;             /* Plus haut */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 2px dotted #475281;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 24px;
}

.dashboard-corner {
  border:2px dotted #475281;
  border-radius: 10px;
  padding: 18px 14px;
  color: #fff;
  box-shadow: 0 2px 12px #0002;

  display: flex;
  flex-direction: column;
}

.dashboard-corner h3 {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.dashboard-corner ul {
  padding-left: 18px;
  margin: 0;
  text-align: left;
}

.dashboard-corner li {
  margin-bottom: 8px;
  line-height: 1.5;
  color: #e0e0e0;
  font-size: 1rem;
}

.dashboard-corner a {
  color: #b7ac0f;
  text-decoration: underline;
  word-break: break-all;
}

.visuels-btn {
  border: 2px dotted #b7ac0f;
  color: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  margin-top: 0;
}

.visuels-btn:hover {
  background: #475281;
}

.visuels-list {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.visuel-img {
  flex: 1 1 calc(50% - 12px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  height: 0;
  padding-top: 100%;
  /* Aspect ratio 1:1 */
}

.visuel-img img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2.5px solid #475281;
  background: #181c1f;
}

.visuels-modal {
  position: fixed;
  inset: 0;
  background: rgba(24, 28, 31, 0.98);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
  overflow-y: auto;
}

.visuels-modal h3 {
  color: #a8b842;
  margin-bottom: 18px;
}

.close-btn {  
  position: absolute;
  top: 24px;
  right: 32px;
  background: #23263a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 10;
}

.close-btn:hover {
  background: #475281;
}

.card-stack-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  /* or 100vh if you want full height */
  width: 100%;
}

.card-stack {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 420px;
  width: 320px;
  position: relative;
}

/* Carousel styles */
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 24px;
}

.carousel-image {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Ajout du fond à pois */
  background:
    radial-gradient(circle, #475281 0.5px, transparent 1px),
    radial-gradient(circle, #475281 0.5px, transparent 1px);
  background-size: 12px 12px;
  background-position: 10px 10px, 6px 6px;
  border-radius: 20%;
  padding: 32px;
}

.carousel-image img {
  display: block;
  max-width: 90vw;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
  border: 3px dotted #475281 ;
  /* Bordure plus visible */
  background: #181c1f;
  box-shadow: 0 2px 12px #0002;
}

.carousel-count {
  margin-top: 8px;
  color: #fff;
  font-size: 1rem;
  text-align: center;
}

.carousel-btn {
  background: #23263a;
  color: #42b883;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.carousel-btn:hover {
  background: #475281;
}

@media (max-width: 600px) {
  .table-container {
    width: 100vw;
    height: 100vh;
    margin-top: 50px;
    padding: 0;
  }

  .container {
    width: 100vw;
    height: 100vh;
    border: none;
    border-radius: 0;
    margin: 0;
  }

  .nav {
    height: auto;
    padding: 8px 4px;
    border-radius: 0;
    border-bottom: 1px solid #475281;
  }

  .tabs-container {
    font-size: 12px;
    gap: 4px;
    padding: 0 4px;
  }

  .tab {
    font-size: 11px;
    padding: 8px 10px;
    min-width: max-content;
    border-radius: 8px;
    margin-right: 4px;
  }

  .dashboard-container {
    margin: 8px;
    padding: 0;
    overflow-y: auto;
  }

  .brand-dashboard {
    max-width: 100%;
    width: 100%;
    padding: 16px 12px;
    border: 1px dotted #475281;
    border-radius: 12px;
    height: auto;
    min-height: auto;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Spécifie l'ordre et la position des sections */
  .dashboard-corner:nth-child(1) { /* À savoir */
    grid-column: 1;
    grid-row: 1;
  }

  .dashboard-corner:nth-child(2) { /* Wishlist */
    grid-column: 1;
    grid-row: 2;
  }

  .dashboard-corner:nth-child(3) { /* Shops */
    grid-column: 1;
    grid-row: 3;
  }

  .dashboard-corner:nth-child(4) { /* Liens */
    grid-column: 1;
    grid-row: 4;
    flex-direction: row;
    height:fit-content;
  }

  /* Conteneur spécial pour shops et liens côte à côte */
  .shops-links-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    grid-column: 1;
    grid-row: 3;
  }

  .visuels-modal {
    padding-top: 20px;
    padding-bottom: 32px;
    min-height: 100vh;
  }

  .carousel {
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin-bottom: 0;
    justify-content: flex-end;
  }

  .carousel-mid {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .carousel-image {
    margin-bottom: 12px;
  }

  .carousel-count {
    margin-bottom: 18px;
  }

  .carousel-btn {
    position: static;
    margin: 0 12px 0 12px;
    width: 56px;
    height: 56px;
    font-size: 2rem;
    /* Pour placer les boutons en bas */
  }

  .carousel-controls {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 12px;
    margin-top: 0;
  }

  .close-btn {
    position: fixed;
    left: 50%;
    bottom: 24px;
    top: auto;
    right: auto;
    transform: translateX(-50%);
    z-index: 100;
    padding: 12px 24px;
    font-size: 1.1rem;
    border-radius: 12px;
  }
}

@media (max-width: 600px) {
  .carousel-actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    left: 0;
    right: 0;
    bottom: 24px;
    z-index: 101;
    width: 100vw;
    background: none;
    padding: 0 0 8px 0;
  }

  .carousel-btn {
    width: 56px;
    height: 56px;
    font-size: 2rem;
    margin: 0;
    border-radius: 50%;
  }

  .close-btn {
    position: static;
    transform: none;
    padding: 12px 24px;
    font-size: 1.1rem;
    border-radius: 12px;
    background: #23263a;
    color: #fff;
    border: none;
    cursor: pointer;
  }
}

@media (max-width: 400px) {
  .tab {
    font-size: 10px;
    padding: 6px 8px;
  }

  .dashboard-corner {
    padding: 10px 8px;
  }

  .dashboard-corner h3 {
    font-size: 0.95rem;
  }

  .dashboard-corner li {
    font-size: 0.85rem;
  }

  .carousel-image {
    padding: 16px;
  }

  .carousel-btn {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
}
@media (min-width: 600px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 24px;
  }

  .dashboard-visuels-btn {
    grid-column: 1 / span 2; /* Prend les deux colonnes */
    grid-row: 4;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0;
  }
}
/* Conteneur pour shops et liens sur mobile */
.shops-links-container {
  display: contents; /* Par défaut, se comporte comme si le conteneur n'existait pas */
}

@media (max-width: 600px) {
  .shops-links-container {
    display: flex;
    flex-direction: row;
    gap: 12px;
    width: 100%;
    grid-column: 1;
    grid-row: 3;
  }
  .shops-links-container .dashboard-corner {
    flex: 1 1 0;
    min-width: 0;
    min-height: 80px;
    margin: 0;
    padding: 12px 8px;
  }
}
</style>
