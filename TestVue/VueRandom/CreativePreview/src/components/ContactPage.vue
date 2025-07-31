<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion } from 'motion-v'
import { instagramIcon, githubIcon, linkedinIcon, formIcon, vueIcon, motionIcon } from '@/assets/icons'

const openIndex = ref(-1)
function toggleOpen(idx) {
    openIndex.value = openIndex.value === idx ? -1 : idx
}

const scriptURL = 'https://script.google.com/macros/s/AKfycbxmnQZxiMbSn5OS_ucHtgPQ2aYc9Qgy0J5JVsa5zVCQO_35SY8H4ybfERfnVvgVmgnI/exec'
const formRef = ref(null)

onMounted(() => {
  if (formRef.value) {
    formRef.value.addEventListener('submit', async (e) => {
      e.preventDefault()
      try {
        await fetch(scriptURL, { method: 'POST', body: new FormData(formRef.value!) })
        alert("Merci pour ton retour :)")
        window.location.reload()
      } catch (error: any) {
        console.error('Error!', error.message)
      }
    })
  }
})

onUnmounted(() => {
  if (formRef.value) {
    formRef.value.onsubmit = null
  }
})
</script>

<template>
    <div class="page-container">
        <div class="first-half">
            <h1>Contact</h1>
            <div class="contact-container">
                <motion.div :layout="true" :data-open="openIndex === 0" :initial="{ borderRadius: '50px' }"
                    :class="['parent', openIndex === 0 ? 'parent-github' : '']" @click="toggleOpen(0)">
                    <motion.div :data-open="openIndex === 0" :layout="true" class="child" v-html="githubIcon" />
                    <h1><a href="https://github.com/PharotZ" target="_blank" rel="noopener noreferrer">Mon GitHub</a>
                    </h1>
                </motion.div>

                <motion.div :layout="true" :data-open="openIndex === 1" :initial="{ borderRadius: '50px' }"
                    :class="['parent', openIndex === 1 ? 'parent-instagram' : '']" @click="toggleOpen(1)">
                    <motion.div :data-open="openIndex === 1" :layout="true" class="child" v-html="instagramIcon" />
                    <h1><a href="https://www.instagram.com/t4xyo" target="_blank" rel="noopener noreferrer">Mon
                            Instagram</a></h1>
                </motion.div>

                <motion.div :layout="true" :data-open="openIndex === 2" :initial="{ borderRadius: '50px' }"
                    :class="['parent', openIndex === 2 ? 'parent-linkedin' : '']" @click="toggleOpen(2)">
                    <motion.div :data-open="openIndex === 2" :layout="true" class="child" v-html="linkedinIcon" />
                    <h1><a href="https://www.linkedin.com/in/theo-baron-72944929b" target="_blank"
                            rel="noopener noreferrer">Mon Linkedin</a></h1>
                </motion.div>

                <motion.div :layout="true" :data-open="openIndex === 3" :initial="{ borderRadius: '50px' }"
                    :class="['parent', openIndex === 3 ? 'parent-form' : '']" @click="toggleOpen(3)">
                    <motion.div :data-open="openIndex === 3" :layout="true" class="child" v-html="formIcon" />
                    <div class="parent-content">
                        <h1><span class="icon-label">Feedback Form</span></h1>
                        <form ref="formRef" enctype="text/plain" @click.stop name="contact-form">
                            <textarea id="nom" placeholder="Qui es-tu?" rows="1" cols="25" name="nom"></textarea>
                            <textarea placeholder="Ton feedback..." rows="4" cols="25" name="feedback"></textarea>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
        <div class="second-half">
            <h1>Details</h1>
            <div class="contact-container">
                <motion.div :layout="true" :data-open="openIndex === 4" :initial="{ borderRadius: '50px' }"
                    :class="['parent', openIndex === 4 ? 'parent-vue' : '']" @click="toggleOpen(4)">
                    <div style="display: flex; align-items: center; flex-direction: column;">
                        <div style="display: flex; align-items: center; flex-direction: row;">
                            <motion.div :data-open="openIndex === 4" :layout="true" class="child" v-html="vueIcon" />
                            <h1><a href="https://vuejs.org" target="_blank" rel="noopener noreferrer"><span
                                    class="icon-label">Vue</span></a></h1>
                        </div>
                        <p style="padding: 10px;">Vue.js est un framework JavaScript progressif. J'ai commencé à
                            l'utiliser en cours à telecom
                            et
                            ensuite durant mon projet ingénieur (maintenant mon stage).
                            Il s'agit d'un framework polyvalent et complet, mais je souhaitais de l'explorer plus en
                            profondeur, c'est pour cela que j'ai commencé a manipuler des librairies annexes, tel que
                            motion.
                        </p>
                    </div>
                </motion.div>

                <motion.div :layout="true" :data-open="openIndex === 5" :initial="{ borderRadius: '50px' }"
                    :class="['parent', openIndex === 5 ? 'parent-motion' : '']" @click="toggleOpen(5)">

                    <div style="display: flex; align-items: center; flex-direction: column;">
                        <div style="display: flex; align-items: center; flex-direction: row;">
                            <motion.div :data-open="openIndex === 5" :layout="true" class="child" v-html="motionIcon" />
                            <h1><a href="https://motion.dev/docs" target="_blank" rel="noopener noreferrer"><span
                                    class="icon-label">Motion</span></a></h1>
                        </div>

                        <p style="padding: 10px;">Motion est une librairie de Vue.js qui permet de créer des animations
                            fluides et
                            performantes.
                            J'ai commencé à l'utiliser afin d'animer plus simplement mes composants et de rendre
                            l'expérience utilisateur plus agréable.
                            Bien que la documentation soit assez fournie, j'ai eu quelques difficultés à comprendre
                            certaines fonctionnalités.
                            Une fois maitrisée, cette librairie devient un outil très puissant.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
</template>

<style>
.page-container {
    display: flex;
    flex-direction: row;
}

.first-half,
.second-half {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px;
    width: 100%;
    height: 100%;
}

.contact-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.parent {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background-color: #f5f5f5;
    margin: 12px 0;
}

.parent span,
.parent-content,
.parent a,
.parent form,
.parent p {
    display: none;
}

.parent[data-open="true"] {
    width: 400px;
    min-height: 100px;
    height: auto;
    padding: 10px;
    justify-content: flex-start;
    z-index: 10;
}

.parent[data-open="true"] span,
.parent[data-open="true"] a,
.parent[data-open="true"] form,
.parent[data-open="true"] .parent-content {
    display: flex;
    margin-left: 10px;
    font-size: 24px;
}

.parent[data-open="true"] p {
    display: flex;
    margin-top: 10px;
    font-size: 12px;
    color: #ffffff;
}

.child {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.parent-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

a {
    color: #ffffff;
    text-decoration: none;
    font-size: 16px;
}

textarea {
    height: 80px;
    padding: 10px;
    border-radius: 5px;
    background-color: #000000;
    color: white;
    border: 2px dotted #475281;
    resize: none;
}

#nom {
    height: 40px;
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
}

button {
    margin-top: 10px;
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #000000;
    color: white;
    border: 2px dotted #475281;
    cursor: pointer;
}

.parent-github[data-open="true"] {
    background-color: #000000;
    border: 2px dotted #475281;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    color: #fff;
}

.parent-instagram[data-open="true"] {
    background: radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
    border: 2px dotted #ffffff;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    color: #fff;
}

.parent-linkedin[data-open="true"] {
    background-color: #4143d3;
    border: 2px dotted #ffffff;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    color: #fff;
}

.parent-form[data-open="true"] {
    background-color: #000000;
    border: 2px dotted #95a8ff;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    color: #fff;
}

.parent-vue[data-open="true"] {
    background-color: #000000;
    border: 2px dotted #42b883;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    color: #fff;
}

.parent-vue[data-open="true"] a {
    color: #42b883;
}

.parent-motion[data-open="true"] {
    background-color: #000000;
    border: 2px dotted #fffb00;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.2);
    color: #fff;
}

.parent-motion[data-open="true"] a {
    color: #fffb00;
}


@media (max-width: 600px) {
    .page-container {
        padding: 20px;
        flex-direction: column;
    }

    .first-half {
        margin-top: 50px;
    }

    .first-half,
    .second-half {
        width: 100%;
        height: auto;
        padding: 0px;
    }

    .contact-container {
        width: 100%;
        padding: 0;
    }

    .parent {
        width: 70px;
        height: 70px;
        margin: 8px 0;
    }

    .parent[data-open="true"] {
        width: 90vw;
        min-width: 0;
        min-height: 70px;
        height: auto;
        padding: 8px;
    }

    .parent[data-open="true"] span,
    .parent[data-open="true"] a,
    .parent[data-open="true"] form,
    .parent[data-open="true"] .parent-content {
        font-size: 1rem;
        margin-left: 10px;
    }

    .child {
        width: 28px;
        height: 28px;
    }

    textarea {
        height: 60px;
        font-size: 0.95rem;
        padding: 6px;
    }

    button {
        padding: 8px 16px;
        font-size: 0.95rem;
    }
}
</style>
