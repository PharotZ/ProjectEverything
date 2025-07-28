import { createRouter, createWebHistory } from 'vue-router';
import ParallaxScroll from './components/ParallaxScroll.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import Contact from './components/ContactPage.vue';
import Fashion from './components/FashionTable.vue';

const routes = [
    {
        path: '',
        name: 'Home',
        component: ParallaxScroll,
    },
    {
        path: '/ParallaxScroll',
        name: 'Parallax',
        component: ParallaxScroll,
    },
    {
        path: '/wheel',
        name: 'Wheel',
        component: MusicPlayer,
    },
    {
        path: '/contact',
        name: 'Contact',
        component: Contact,
    },
    {
        path: '/fashion',
        name: 'Fashion',
        component: Fashion,
    }
];
const router = createRouter({
    history: createWebHistory('/'),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // Always scroll to top when changing routes
        return { top: 0 }
    }
});

export default router;
