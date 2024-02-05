import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      {
         path: '/gallery',
         name: 'gallery',
         component: () => import('@/views/GalleryView.vue'),
      },
      {
         path: '/',
         name: 'workspace',
         component: () => import('@/views/WorkspaceView.vue'),
      },
   ],
});

export default router;
