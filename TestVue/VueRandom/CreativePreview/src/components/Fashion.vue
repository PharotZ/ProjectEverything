<script setup>
import { ref } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

const allBrands = [
  {
    label: "Post Archive Faction",
    facts: ["Fondée en Corée du Sud", "Design technique et expérimental", "Très populaire dans le streetwear"],
    wishlist: ["8.0 Parka Center (Black)", "DV + PAF Junya Racer Off-Black/D+ Gray Gradient"],
    shops: ["Séoul", "Online"],
    links: { website: "https://postarchivefaction.com", instagram: "https://instagram.com/postarchivefaction" }
  },
  {
    label: "MM6",
    facts: ["Maison Margiela ligne 6", "Approche déstructurée", "Célèbre pour ses accessoires innovants"],
    wishlist: ["Sac Japanese", "Tabi Boots"],
    shops: ["Paris", "Tokyo", "Online"],
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
            :animate="{ y: 0, opacity: 1 }" :exit="{ y: -10, opacity: 0 }" :transition="{ duration: 0.2 }" class="brand-dashboard">
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
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
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
  height: 100vh; /* Fix vertical scroll */
  overflow: hidden; /* Prevent scrolling */
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
  margin-top: 0; /* Remove margin to fix scroll */
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
  width: auto; /* <-- Fix: let tabs grow only as needed */
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
  flex: none; /* <-- Fix: tabs only as wide as their content */
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

@media (max-width: 600px) {
  .table-container {
    width:96vw;
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
