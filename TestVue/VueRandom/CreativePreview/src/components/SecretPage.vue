<script setup lang="ts">
import { ref } from 'vue'

const password = ref('')
const isPasswordCat = ref(false)
const isPasswordAmogus = ref(false)
const isPasswordGoon = ref(false)
const isPasswordFeur = ref(false)
const isPasswordCoubeh = ref(false)

function checkPassword() {
    if (password.value === 'cat') {
        isPasswordCat.value = true
        isPasswordAmogus.value = false
        isPasswordGoon.value = false
        isPasswordFeur.value = false
        isPasswordCoubeh.value = false
    } else if (password.value === 'amogus') {
        isPasswordAmogus.value = true
        isPasswordCat.value = false
        isPasswordGoon.value = false
        isPasswordFeur.value = false
        isPasswordCoubeh.value = false
    } else if (password.value === 'goon') {
        isPasswordCat.value = false
        isPasswordAmogus.value = false
        isPasswordGoon.value = true
        isPasswordFeur.value = false
        isPasswordCoubeh.value = false
    } else if (password.value === 'feur') {
        isPasswordCat.value = false
        isPasswordAmogus.value = false
        isPasswordGoon.value = false
        isPasswordFeur.value = true
        isPasswordCoubeh.value = false
    } else if (password.value === 'coubeh') {
        isPasswordCat.value = false
        isPasswordAmogus.value = false
        isPasswordGoon.value = false
        isPasswordFeur.value = false
        isPasswordCoubeh.value = true
    }
}
</script>

<template>
    <div class="secret-page">
        <div class="password-container">
            <input type="password" v-model="password" placeholder="Enter password" />
            <button @click="checkPassword">Submit</button>
        </div>

        <div class="secret-content" v-if="isPasswordCat">
            <img src="../assets/cat-spinning.gif" alt="Secret"/>
        </div>
        <div class="secret-content" v-if="isPasswordAmogus">
            <img src="../assets/amogus.gif" alt="Secret" />
        </div>
        <div class="secret-content" v-if="isPasswordGoon">
            <img src="../assets/goon.gif" alt="Secret" />
            <p>Tom arrête.</p>
        </div>
        <div class="secret-content" v-if="isPasswordFeur">
            coubeh.
        </div>
        <div class="secret-content" v-if="isPasswordCoubeh">
            feur.
        </div>
    </div>
</template>

<style scoped>
.password-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.password-container input {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.password-container button {
    padding: 10px 15px;
    background-color: #0000007f;
    color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
}

.password-container button:hover {
    background-color: #3b3f4478;
}

.secret-content {
    margin-top: 20px;
    text-align: center;
}

.secret-content img {
    max-width: 200px;
    height: auto;
    border-radius: 10px;
}
.secret-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
