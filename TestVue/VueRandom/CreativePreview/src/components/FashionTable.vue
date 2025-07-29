<script setup>
import { ref, watch } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import CardStackCard from './CardStackCard.vue'

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
    links: { website: "https://badson.us", instagram: "https://instagram.com/badson.us" }
  },
  {
    label: "Projectisr",
    facts: ["Designs avant-gardistes", "Petite production, pièces uniques"],
    wishlist: ["Chemise oversize", "Pantalon Projectisr"],
    shops: ["Séoul", "Online"],
    links: { website: "https://projectisr.com", instagram: "https://instagram.com/projectisr_official" }
  },
  {
    label: "Racerworldwide",
    facts: ["Inspirée par la course automobile", "Couleurs vives et logos forts"],
    wishlist: ["Veste Racing", "T-shirt logo"],
    shops: ["Londres", "Online"],
    links: { website: "https://racerworldwide.com", instagram: "https://instagram.com/racerworldwide" }
  },
  {
    label: "kuurth",
    facts: ["Esthétique futuriste", "Utilisation de matériaux techniques"],
    wishlist: ["Veste tech", "Pantalon cargo"],
    shops: ["Berlin", "Online"],
    links: { website: "https://kuurth.com", instagram: "https://instagram.com/kuurth.co" }
  },
  {
    label: "hillllside",
    facts: ["Influence outdoor", "Couleurs naturelles et coupes larges"],
    wishlist: ["Invisibility Jacket"],
    shops: ["Genève", "Online"],
    links: { website: "https://hillsidestudio.store/?fbclid=PAZXh0bgNhZW0CMTEAAadvxG_E9Ot88DOR7KiVgQTcZyLUx7Ti4DYhLyFUFQET-KL2eS3Q6i56So4YZA_aem_1PA6Yhq__niGXG5boXEQcw", instagram: "https://instagram.com/hillllside" }
  },
  {
    label: "leonmanuelblanck",
    facts: ["Créateur indépendant", "Pièces faites main"],
    wishlist: ["Distrortion Tall Boots RSRV"],
    shops: ["Strasbourg", "Online"],
    links: { website: "https://leonmanuelblanck.shop", instagram: "https://instagram.com/leonmanuelblanck" }
  },
  {
    label: "julid1101",
    facts: ["Style urbain", "Créé par l'artiste Cherifkhris"],
    wishlist: ["Dot Jacket", "Cardigan TAIDHTH"],
    shops: ["Online"],
    links: { website: "https://julid1101.com", instagram: "https://instagram.com/julid1101" }
  }
]

const tabs = allBrands
const selectedTab = ref(tabs[0])
const showVisuels = ref(false)
const visuelCards = ref([])

watch(
  () => showVisuels.value,
  (open) => {
    if (open && selectedTab.value && selectedTab.value.images && selectedTab.value.images.length) {
      visuelCards.value = selectedTab.value.images.map((url, i) => ({ id: i + 1, url }))
    }
  }
)

function removeVisuelCard(id) {
  visuelCards.value = visuelCards.value.filter(card => card.id !== id)
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
                  <!-- Ajoute d'autres liens si besoin -->
                </ul>
                <span v-else>Aucun lien disponible.</span>
              </section>
              <section class="dashboard-corner">
                <button class="visuels-btn" @click="showVisuels = true">
                  Voir les visuels
                </button>
              </section>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      <!-- Section visuels à part -->
      <div v-if="showVisuels" class="visuels-modal">
        <button class="close-btn" @click="showVisuels = false">Fermer</button>
        <h3>Visuels de {{ selectedTab.label }}</h3>
        <div v-if="selectedTab && selectedTab.images && selectedTab.images.length">
          <div class="card-stack-bg">
            <div class="card-stack">
              <CardStackCard
                v-for="(card, idx) in visuelCards"
                :key="card.id"
                :card="card"
                :is-front="card.id === visuelCards[visuelCards.length - 1]?.id"
                :index="visuelCards.length - 1 - idx"
                @swipe="removeVisuelCard"
              />
              <div v-if="visuelCards.length === 0" class="no-more-cards">Plus de visuels !</div>
            </div>
          </div>
        </div>
        <span v-else>Aucun visuel pour l’instant.</span>
      </div>
    </div>
  </div>
</template>

<style>
.table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  /* Fix vertical scroll */
  overflow: hidden;
  /* Prevent scrolling */
  margin-top: 50px;
}

.container {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-top: 0;
  /* Remove margin to fix scroll */
}

.nav {
  background: #22263a;
  padding: 5px 5px 0;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid #475281;
  min-height: 44px;
  max-width: 100vw;
  overflow-x: auto;
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
  background: #2c3150;
  color: #42b883;
}

.tab[style*="background-color: rgb(238, 238, 238)"] {
  background: #475281 !important;
  color: #42b883 !important;
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
  flex: 1;
  background: #181c1f;
}

.brand-dashboard {
  background: #22263a;
  border-radius: 16px;
  padding: 32px 24px;
  min-width: 260px;
  max-width: 700px;
  box-shadow: 0 4px 32px #0004;
  margin: 0 auto;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 24px;
}

.dashboard-corner {
  background: #23263a;
  border-radius: 10px;
  padding: 18px 14px;
  color: #fff;
  box-shadow: 0 2px 12px #0002;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.dashboard-corner h3 {
  color: #42b883;
  font-size: 1.1rem;
  margin-bottom: 10px;
  font-family: var(--font-headings, 'Montserrat', sans-serif);
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
  color: #42b883;
  text-decoration: underline;
  word-break: break-all;
}

.visuels-btn {
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: auto;
  transition: background 0.2s;
}

.visuels-btn:hover {
  background: #369e6f;
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
  border: 1.5px solid #475281;
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
  justify-content: flex-start;
  padding-top: 60px;
  overflow-y: auto;
}

.visuels-modal h3 {
  color: #42b883;
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

@media (max-width: 600px) {
  .table-container {
    width: 96vw;
  }

  .container {
    height: 100vh;
    padding: 0;
  }

  .nav {
    height: auto;
    padding: 2px 2px 0;
  }

  .tab {
    font-size: 13px;
    padding: 8px 8px;
  }

  .icon {
    font-size: 64px;
  }
}

@media (max-width: 700px) {
  .brand-dashboard {
    max-width: 98vw;
    padding: 12px 2vw;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    gap: 16px;
  }
}
</style>
