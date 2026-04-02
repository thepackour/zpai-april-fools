import { createRouter, createWebHistory } from 'vue-router'
import ArchiveView from '../views/ArchiveView.vue'
import HomePage from '../views/Home.vue'

const routes = [
  {
    path: '/april-fools',
    name: 'AprilFoolsArchive',
    component: ArchiveView
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
