import { createRouter, createWebHistory } from 'vue-router';
import ParallaxScroll from './components/ParallaxScroll.vue';
import WheelScrolling from './components/WheelScrolling.vue';
import tets from './components/tets.vue';
import Home from './components/Home.vue';

const routes = [
    {
        path: '',
        name: 'Home',
        component: Home,
    },
    {
        path: '/ParallaxScroll',
        name: 'Parallax',
        component: ParallaxScroll,
    },
    {
        path: '/wheel',
        name: 'Wheel',
        component: WheelScrolling,
    },
    {
        path: '/test',
        name: 'Test',
        component: tets,
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
